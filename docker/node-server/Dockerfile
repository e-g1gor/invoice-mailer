FROM buildkite/puppeteer:7.1.0

RUN mkdir -p /usr/webapp

WORKDIR /usr/webapp

COPY . ./
RUN cp ./docker/node-server/entrypoint.sh ./

RUN rm -rf ./docker

RUN chmod +x ./bin/www
RUN chown -cR node .
USER node

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]
