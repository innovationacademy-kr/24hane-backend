#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

APP_NAME='24-not-enough'
APP_PATH='dist/main.js'

#pm2 start dist/main.js --name 24-not-enough

die () {
    echo "$*"
    exit 1
} >&2

check_cmd() {
    command -v "$1" > /dev/null 2>&1
}

main() {
  if ! check_cmd pm2; then  
    die "${RED}PM2 not found${NC}"  
  fi
  printf "${GREEN}1. install node packages${NC}\n"
  npm install
  printf "${GREEN}2. app (${APP_NAME}) build${NC}\n"
  npm run build
  local _pid=$(pm2 pid ${APP_NAME} 2>&1)
  if [ -n "${_pid}" ]; then
    printf "${GREEN}3. reload app (PID : $_pid)${NC}\n"
    pm2 reload "${APP_NAME}"
  else
    printf "${GREEN}3. start app${NC}\n"
    pm2 start "${APP_PATH}" --name "${APP_NAME}"
  fi
}

main "$@"