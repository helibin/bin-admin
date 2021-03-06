#!/bin/bash

log_file="$PWD/logs/auto-update.log"

function log() {
    echo '' 2>&1 | tee -a $log_file
    echo -e "\033[1;36m$1\033[1;0m" 2>&1 | tee -a $log_file
}

run_time=`date "+%Y-%m-%d %H:%M:%S"`
log "===== 脚本启动 ($run_time)====="

log '还原代码修改'
git checkout .

log '更新remote'
git remote update 2>&1 | tee -a $log_file
git fetch --tags  2>&1 | tee -a $log_file

if [ $# -eq 1 ]; then
    log "切换到分支：$1"
    git checkout $1 2>&1 | tee -a $log_file
fi

log '获取最新代码'
git pull 2>&1 | tee -a $log_file

log '安装第三方包'
npm --registry=http://registry.npm.taobao.org install 2>&1 | tee -a $log_file

log '代码编译'
npm run build:prod

log "拷贝代码"
\cp -rf dist/. deploy/
