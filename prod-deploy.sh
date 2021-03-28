#!/bin/bash


NODE_ENV=production

docker-compose up -d node-server
docker-compose logs --tail=0 --follow
