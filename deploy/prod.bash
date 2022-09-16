#!/bin/bash

ssh -p 49155 footzi@ovz1.j676141.m6zkp.vps.myjino.ru "
  cd /var/www/our-budget_backend/ && sudo -S git pull &&
  sudo yarn && sudo yarn build && sudo yarn stop:pm2 && sudo yarn start:pm2
"
