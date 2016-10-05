NODE_PATH := $(shell npm bin)

all: build/bundle.js

$(NODE_PATH)/tsc $(NODE_PATH)/webpack:
	npm install

%.js: %.ts $(NODE_PATH)/tsc
	$(NODE_PATH)/tsc

%.js: %.tsx $(NODE_PATH)/tsc
	$(NODE_PATH)/tsc

build/bundle.js: webpack.config.js app.js $(NODE_PATH)/webpack
	NODE_ENV=production $(NODE_PATH)/webpack --config $<

dev: webpack.config.js $(NODE_PATH)/webpack
	(\
    $(NODE_PATH)/webpack --watch --config $< & \
    $(NODE_PATH)/tsc -w & \
    wait)
