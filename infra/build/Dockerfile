FROM ubuntu:26.04@sha256:5e275723f82c67e387ba9e3c24baa0abdcb268917f276a0561c97bef9450d0b4

ARG BUILD_USER=ubuntu
ENV HOME=/home/${BUILD_USER}

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  ca-certificates=20260223 \
  git=1:2.53.0-1ubuntu1 \
  openssh-client=1:10.2p1-2ubuntu3 \
  jq=1.8.1-4ubuntu2 \
  curl=8.18.0-1ubuntu2 \
  unzip=6.0-29ubuntu1 \
  # Required for Cypress \
  libgtk-3-0t64=3.24.52-0ubuntu1 \
  libgbm-dev=26.0.3-1ubuntu1 \
  libnotify-dev=0.8.8-1 \
  libnss3=2:3.120-1ubuntu2 \
  libxss1=1:1.2.3-1build4 \
  libasound2t64=1.2.15.3-1ubuntu1 \
  libxtst6=2:1.2.5-1build1 \
  xauth=1:1.1.2-1.1build1 \
  xvfb=2:21.1.22-1ubuntu1 \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/*

ARG AWSCLI_VERSION=2.34.38
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64-$AWSCLI_VERSION.zip" -o "awscliv2.zip" && \
  unzip awscliv2.zip && \
  ./aws/install && \
  rm -rf aws awscliv2.zip

ARG TERRAFORM_VERSION=1.14.9
RUN curl https://releases.hashicorp.com/terraform/$TERRAFORM_VERSION/terraform_${TERRAFORM_VERSION}_linux_amd64.zip -o /tmp/terraform.zip && \
  unzip -d /usr/local/bin /tmp/terraform.zip && \
  rm /tmp/terraform.zip

ARG HADOLINT_VERSION=2.14.0
RUN curl -L https://github.com/hadolint/hadolint/releases/download/v$HADOLINT_VERSION/hadolint-Linux-x86_64 \
    -o /usr/local/bin/hadolint \
    && chmod +x /usr/local/bin/hadolint

USER ${BUILD_USER}

ARG NVM_VERSION=0.40.4
ARG NODE_VERSION=24.15.0
ENV NODE_VERSION=$NODE_VERSION
ENV NVM_DIR=${HOME}/.nvm

# Install nvm with node and npm
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash
RUN . $NVM_DIR/nvm.sh \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN mkdir -p ${HOME}/.ssh \
    && mkdir -p ${HOME}/.docker \
    && mkdir -p ${HOME}/.aws \
    && mkdir -p ${HOME}/build

COPY known_hosts ${HOME}/.ssh/known_hosts
COPY config ${HOME}/.aws/config
COPY run.sh ${HOME}/build/run.sh
COPY run-test.sh ${HOME}/build/run-test.sh
COPY build_functions.sh ${HOME}/build/build_functions.sh

WORKDIR ${HOME}/build
ENTRYPOINT ["./run.sh"]
