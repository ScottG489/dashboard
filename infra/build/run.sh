#!/bin/bash
set -ex

source $HOME/build/build_functions.sh

set +x
setup_credentials "$1"
set -x

# These are prefixed with an _ because they have global scope and the build_function lib may have overlap
declare -r _PROJECT_NAME='dashboard'
declare -r _GIT_REPO='git@github.com:ScottG489/dashboard.git'
declare -r _RUN_TASK=$(jq -r .RUN_TASK <<< "$1")
declare -r _GIT_BRANCH=$(jq -r .GIT_BRANCH <<< "$1")
# Used for the domain name but also the s3 bucket (AWS requires them to be the same)
declare -r _BACKEND_DOMAIN='giminiani.com'
declare -r _TFSTATE_BUCKET_NAME='tfstate-dashboard'

[ -d "$_PROJECT_NAME" ] || git clone --branch $_GIT_BRANCH $_GIT_REPO
cd $_PROJECT_NAME

build_application

$HOME/build/run-test.sh

[ "$_RUN_TASK" != "deploy" ] && exit 0
tf_backend_init $_TFSTATE_BUCKET_NAME

tf_apply "infra/tf"

ui_deploy "infra/tf"
