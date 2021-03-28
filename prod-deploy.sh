#!/bin/bash

chmod -cR ugo+rw .

REDIS_HOST=redis
NODE_ENV=production

docker-compose down
docker-compose up --build --force-recreate -d node-server
docker-compose logs --tail=0 --follow
