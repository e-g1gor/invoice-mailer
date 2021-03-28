#!/bin/bash

sudo chmod -cR ugo+rw .

export REDIS_HOST=redis
export NODE_ENV=development
export EXPRESS_SERVER_DEBUG="invoice-mailer:*"
export CURRENT_UID=$(id -u):$(id -g)


docker-compose stop
docker-compose up -d
docker-compose logs -f node-server pdf-renderer
