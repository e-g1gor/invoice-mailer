FROM node:15-buster

RUN mkdir -p /usr/webapp

WORKDIR /usr/webapp

COPY ./api ./api
COPY ./config ./config
COPY ./app.js ./
COPY ./package*.json ./

COPY ./docker/node-server/entrypoint.sh ./

RUN chown -cR node .
USER node

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
