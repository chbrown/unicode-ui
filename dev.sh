#!/usr/bin/env bash
node_modules/.bin/tsc -m commonjs -t ES5 -w *.ts &
node_modules/.bin/watchify app.js -o build/bundle.js -v &
trap 'kill $(jobs -p)' SIGTERM # EXIT
wait
