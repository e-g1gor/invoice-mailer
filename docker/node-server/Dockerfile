FROM node:15-buster

RUN apt-get update
RUN apt-get install -y chromium

RUN mkdir -p /usr/webapp

WORKDIR /usr/webapp

COPY . ./
RUN cp ./docker/node-server/entrypoint.sh ./

RUN rm -rf ./docker

RUN chown -cR node .
USER node

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
