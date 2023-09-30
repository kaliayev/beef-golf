#! /bin/bash

# install
cd web/
npm run build
cd ../server
scp -r .env package.json index.js public db log prisma constants.js src pi@192.168.86.125:/home/pi/golf
# push a new db if needed
# WARNING: should only send the dbs over once/db, then they live there, otherwise you'll overwrite what's there
# scp db/golf.db pi@<ip>:/home/pi/golf/db
