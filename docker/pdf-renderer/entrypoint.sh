#!/bin/bash

#  Install dependencies on service restart
npm install

echo "NODE_ENV: ${NODE_ENV}"
PUPPETEER_EXECUTABLE_PATH=$(which google-chrome-stable)
echo "Chrome executable path used: $PUPPETEER_EXECUTABLE_PATH"
echo "Starting pdf rendering worker."

node ./pdf-renderer/pdf-renderer.js
