FROM node:8.9.3
#FROM ubuntu:16.04

#RUN echo "deb http://us-west-2.ec2.archive.ubuntu.com/ubuntu/ xenial multiverse" >> /etc/apt/sources.list.d/multiverse.list \
#echo "deb http://us-west-2.ec2.archive.ubuntu.com/ubuntu/ xenial-updates multiverse" >> /etc/apt/sources.list.d/multiverse.list \
#echo "deb http://us-west-2.ec2.archive.ubuntu.com/ubuntu/ xenial-backports main restricted universe multiverse" >> /etc/apt/sources.list.d/multiverse.list \
#&& apt-get update \
#&& apt-get install -y debconf-utils \
#&& echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
#
#RUN apt-get install -y apt-utils apt-transport-https curl libfontconfig ttf-mscorefonts-installer ssh git
#
## Install node
#RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
#&& apt-get install -y nodejs build-essential
#
#ENV DEBIAN_FRONTEND noninteractive

# Making work directory ready for the node application
RUN mkdir /test-cases-api
WORKDIR /test-cases-api
ADD package.json /test-cases-api/package.json
ADD package-lock.json /test-cases-api/package-lock.json

RUN mkdir -p /root/.ssh
ADD id_rsa /root/.ssh/id_rsa
ADD id_rsa.pub /root/.ssh/id_rsa.pub
RUN eval "$(ssh-agent -s)"
RUN ssh-keyscan -H github.com >> /root/.ssh/known_hosts
RUN chmod 0700 /root/.ssh
RUN chmod 0600 /root/.ssh/id_rsa
RUN chmod 0644 /root/.ssh/id_rsa.pub

RUN npm install

RUN rm -rf /root/.ssh

# Copying the project files
ADD . /test-cases-api

# Exposing server port
EXPOSE 5000

# Starting web server
ENTRYPOINT ["node", "dist/app.js"]
