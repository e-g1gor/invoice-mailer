#!/bin/bash

sudo docker-compose -f docker-compose.prod.yml up -d
sudo docker-compose logs --tail=0 --follow
