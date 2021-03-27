#!/bin/bash

#  Refresh dependencies
npm install

which chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=$(which chromium)

echo "Starting node server."

node ./bin/www.js
