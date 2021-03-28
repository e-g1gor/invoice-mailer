#!/bin/bash

NODE_ENV=development
EXPRESS_SERVER_DEBUG="invoice-mailer:*"

docker-compose up -d
docker-compose logs -f node-server
