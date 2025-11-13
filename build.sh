#!/usr/bin/env bash

readonly IMAGE_NAME='scottg489/dashboard-build:latest'
readonly RUN_TASK=$1
readonly ID_RSA=$2
readonly AWS_CREDENTIALS=$3

read -r -d '' JSON_BODY <<- EOM
  {
  "RUN_TASK": "$RUN_TASK",
  "GIT_BRANCH": "${GITHUB_HEAD_REF:-$GITHUB_REF_NAME}",
  "ID_RSA": "$ID_RSA",
  "AWS_CREDENTIALS": "$AWS_CREDENTIALS"
  }
EOM

curl -v -sS -w '\n%{http_code}' \
  --data-binary "$JSON_BODY" \
  "https://api.conjob.io/job/run?image=$IMAGE_NAME" \
  | tee /tmp/foo \
  | sed '$d' && \
  [ "$(tail -1 /tmp/foo)" -eq 200 ]
