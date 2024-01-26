#!/bin/bash
source .env

ssh -p $DEPLOY_PORT $DEPLOY_URL "
  cd $DEPLOY_FOLDER &&
  git reset --hard origin/master &&
  git pull &&
  npm ci &&
  npm run build &&
  npm run stop:pm2 &&
  npm run start:pm2
"
