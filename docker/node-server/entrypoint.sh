#!/bin/bash

#  Install dependencies on service restart
npm install

echo "NODE_ENV: $NODE_ENV"

echo "Starting node server."

node ./bin/www.js
