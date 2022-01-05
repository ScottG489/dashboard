FROM ubuntu:20.04

RUN apt-get update && \
  DEBIAN_FRONTEND=noninteractive apt-get install -y \
  git \
  awscli \
  jq \
  curl \
  unzip \
  # Required for Cypress
  libgtk2.0-0 \
  libgtk-3-0 \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb

RUN curl https://releases.hashicorp.com/terraform/0.12.26/terraform_0.12.26_linux_amd64.zip -o /tmp/terraform.zip && \
  unzip -d /usr/local/bin /tmp/terraform.zip && \
  rm /tmp/terraform.zip

RUN useradd -m -u 1000 -s /usr/bin/bash build-user
USER build-user

ENV NVM_DIR /home/build-user/.nvm
ENV NODE_VERSION 16.13.1

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
RUN . $NVM_DIR/nvm.sh \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN mkdir /home/build-user/.ssh
COPY known_hosts /home/build-user/.ssh/known_hosts

RUN mkdir /home/build-user/.aws
COPY config /home/build-user/.aws/config

RUN mkdir /home/build-user/.docker

RUN mkdir -p /home/build-user/build
COPY run.sh /home/build-user/build/run.sh
COPY run-test.sh /home/build-user/build/run-test.sh
COPY build_functions.sh /home/build-user/build/build_functions.sh

WORKDIR /home/build-user/build
ENTRYPOINT ["./run.sh"]
