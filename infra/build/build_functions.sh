#!/bin/bash
set -e

get_git_root_dir() {
  echo -n "$(git rev-parse --show-toplevel)"
}

setup_credentials() {
  set +x
  local ID_RSA_CONTENTS
  local AWS_CREDENTIALS_CONTENTS
  readonly ID_RSA_CONTENTS=$(echo -n $1 | jq -r .ID_RSA | base64 --decode)
  readonly AWS_CREDENTIALS_CONTENTS=$(echo -n $1 | jq -r .AWS_CREDENTIALS | base64 --decode)

  printf -- "$ID_RSA_CONTENTS" >/root/.ssh/id_rsa
  printf -- "$AWS_CREDENTIALS_CONTENTS" >/root/.aws/credentials

  chmod 400 /root/.ssh/id_rsa
}

build_application() {
  local ROOT_DIR
  readonly ROOT_DIR=$(get_git_root_dir)
  cd "$ROOT_DIR"

  npm ci

  # Build and package front-end
  export CI=true
  npm run test
  unset CI
}

tf_backend_init() {
  local ROOT_DIR
  local TFSTATE_BACKEND_BUCKET_NAME

  readonly ROOT_DIR=$(get_git_root_dir)
  readonly TFSTATE_BACKEND_BUCKET_NAME=$1

  cd "$ROOT_DIR/infra/tf/backend-init"

  # Initialize terraform backend on first deploy
  aws s3 ls "$TFSTATE_BACKEND_BUCKET_NAME" &&
    (terraform init &&
      terraform import aws_s3_bucket.backend_bucket "$TFSTATE_BACKEND_BUCKET_NAME")
  terraform init
  terraform plan
  terraform apply --auto-approve
}

tf_apply() {
  local ROOT_DIR
  local RELATIVE_PATH_TO_TF_DIR
  local HOSTED_ZONE_DNS_NAME

  readonly ROOT_DIR=$(get_git_root_dir)
  readonly RELATIVE_PATH_TO_TF_DIR=$1

  cd "$ROOT_DIR/$RELATIVE_PATH_TO_TF_DIR"

  terraform init

  # We need to import the zone because it is a shared resource and may already exist
  readonly HOSTED_ZONE_DNS_NAME=$(echo var.domain_name | terraform console)
  [[ -n $HOSTED_ZONE_DNS_NAME ]]
  readonly EXISTING_ZONE_ID=$(aws route53 list-hosted-zones-by-name |
    jq --raw-output --arg name "$HOSTED_ZONE_DNS_NAME" '.HostedZones | .[] | select(.Name == "\($name).") | .Id')
  terraform import module.dashboard_website.aws_route53_zone.r53_zone "$EXISTING_ZONE_ID" || true

  terraform plan
  terraform apply --auto-approve
}

ui_deploy() {
  local ROOT_DIR
  local RELATIVE_PATH_TO_TF_DIR
  local BUCKET_NAME

  readonly ROOT_DIR=$(get_git_root_dir)
  readonly RELATIVE_PATH_TO_TF_DIR=$1

  cd "$ROOT_DIR/$RELATIVE_PATH_TO_TF_DIR"

  readonly BUCKET_NAME=$(terraform show --json | jq --raw-output '.values.outputs.bucket.value')
  [[ -n $BUCKET_NAME ]]

  readonly REACT_APP_BACKEND_SERVER_BASE_URL="http://api.conjob.io"
  export REACT_APP_BACKEND_SERVER_BASE_URL

  cd "$ROOT_DIR"

  export CI=true
  npm run build
  unset CI

  aws s3 sync build/ s3://"$BUCKET_NAME"
}
