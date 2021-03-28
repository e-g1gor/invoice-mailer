#!/bin/bash

chmod -cR ugo+rw .

export REDIS_HOST=redis
export NODE_ENV=production

docker-compose down
docker-compose up --build --force-recreate -d node-server
docker-compose logs --tail=0 --follow
