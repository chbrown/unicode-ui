BIN := node_modules/.bin

all: build/bundle.js

$(BIN)/tsc $(BIN)/webpack:
	npm install

%.js: %.ts $(BIN)/tsc
	$(BIN)/tsc

%.js: %.tsx $(BIN)/tsc
	$(BIN)/tsc

build/bundle.js: webpack.config.js app.js $(BIN)/webpack
	NODE_ENV=production $(BIN)/webpack --config $<

dev: webpack.config.js $(BIN)/webpack
	$(BIN)/webpack --watch --config $<
