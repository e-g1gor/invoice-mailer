FROM node:15-buster

RUN apt-get update
RUN apt-get install -y chromium

RUN mkdir -p /usr/webapp

WORKDIR /usr/webapp

COPY ./config ./config
COPY ./pdf-renderer ./pdf-renderer
COPY ./docker/pdf-renderer/entrypoint.sh ./

RUN chown -cR node .
USER node

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
