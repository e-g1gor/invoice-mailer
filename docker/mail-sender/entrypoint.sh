#!/bin/bash

#  Install dependencies on service restart
npm install

echo "NODE_ENV: $NODE_ENV"

echo "Starting mail sending worker."

node ./mail-sender/mail-sender.js
