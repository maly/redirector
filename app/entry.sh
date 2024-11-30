#!/bin/sh

# start cron
#/usr/sbin/crond -f -l 8 &

#my app
cd /opt/web
#rm static/main.js
#cp static/main.min.js static/main.js
node /opt/web/index.js