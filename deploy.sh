#!/bin/bash

sudo docker-compose up -d
sudo docker-compose logs --tail=0 --follow
