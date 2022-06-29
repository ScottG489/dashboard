FROM ubuntu:20.04

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  git=1:2.25.1-1ubuntu3.4 \
  openssh-client=1:8.2p1-4ubuntu0.5 \
  awscli=1.18.69-1ubuntu0.20.04.1 \
  jq=1.6-1ubuntu0.20.04.1 \
  curl=7.68.0-1ubuntu2.12 \
  unzip=6.0-25ubuntu1 \
  # Required for Cypress
  libgtk2.0-0=2.24.32-4ubuntu4 \
  libgtk-3-0=3.24.20-0ubuntu1.1 \
  libgbm-dev=21.2.6-0ubuntu0.1~20.04.2 \
  libnotify-dev=0.7.9-1ubuntu2 \
  libgconf-2-4=3.2.6-6ubuntu1 \
  libnss3=2:3.49.1-1ubuntu1.7 \
  libxss1=1:1.2.3-1 \
  libasound2=1.2.2-2.1ubuntu2.5 \
  libxtst6=2:1.2.3-1 \
  xauth=1:1.1-0ubuntu1 \
  xvfb=2:1.20.13-1ubuntu1~20.04.2 \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*

RUN curl https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip -o /tmp/terraform.zip && \
  unzip -d /usr/local/bin /tmp/terraform.zip && \
  rm /tmp/terraform.zip

ARG HADOLINT_VERSION=2.10.0
RUN curl -L https://github.com/hadolint/hadolint/releases/download/v$HADOLINT_VERSION/hadolint-Linux-x86_64 \
    -o /usr/local/bin/hadolint \
    && chmod +x /usr/local/bin/hadolint

RUN useradd -m -u 1000 -s /usr/bin/bash build-user
USER build-user

ENV NVM_DIR /home/build-user/.nvm
ENV NODE_VERSION 16.15.1
# Install nvm with node and npm
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
RUN . $NVM_DIR/nvm.sh \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN mkdir /home/build-user/.ssh \
    && mkdir /home/build-user/.docker \
    && mkdir /home/build-user/.aws \
    && mkdir /home/build-user/build

COPY known_hosts /home/build-user/.ssh/known_hosts
COPY config /home/build-user/.aws/config
COPY run.sh /home/build-user/build/run.sh
COPY run-test.sh /home/build-user/build/run-test.sh
COPY build_functions.sh /home/build-user/build/build_functions.sh

WORKDIR /home/build-user/build
ENTRYPOINT ["./run.sh"]
