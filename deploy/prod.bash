#!/bin/bash
source .env

ssh -p $DEPLOY_PORT $DEPLOY_URL "
  cd $DEPLOY_FOLDER &&
  sudo -S git reset --hard origin/master &&
  sudo -S git pull &&
  sudo -S yarn &&
  sudo -S yarn build &&
  sudo -S yarn stop:pm2 &&
  sudo -S yarn start:pm2
"
