FROM ubuntu:xenial
MAINTAINER "Alexander Trauzzi" <atrauzzi@gmail.com>

RUN apt-get update -y
RUN apt-get install -y \
  curl \
  git \
  mercurial \
  python \
  python-setuptools \
  ruby \
  ruby-dev \
  build-essential

RUN easy_install pip

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g yarn
RUN npm install -g typescript

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /protoculture
EXPOSE 4000
