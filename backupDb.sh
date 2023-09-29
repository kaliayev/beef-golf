#! /bin/bash

# copy the current db to the backup location
scp pi@192.168.86.125:/home/pi/golf/db/golf.db ~/Google\ Drive/My\ Drive/Organization/Db\ Backups/Golf/golf-$(date +%Y-%m-%d).db