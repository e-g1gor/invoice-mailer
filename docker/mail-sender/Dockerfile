FROM node:15-buster

RUN mkdir -p /usr/webapp

WORKDIR /usr/webapp

COPY ./config ./config
COPY ./mail-sender ./mail-sender
COPY ./docker/mail-sender/entrypoint.sh ./


RUN chown -cR node .
USER node

ENV NODE_ENV production

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
