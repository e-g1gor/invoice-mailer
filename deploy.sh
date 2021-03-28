#!/bin/bash

chmod -cR ugo+rw .

REDIS_HOST=redis
NODE_ENV=development
EXPRESS_SERVER_DEBUG="invoice-mailer:*"


docker-compose stop
docker-compose up -d
docker-compose logs -f node-server pdf-renderer mail-sender
