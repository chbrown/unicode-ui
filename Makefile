BIN = node_modules/.bin

all: site.css build/unidata.min.js build/bundle.min.js

$(BIN)/tsc $(BIN)/browserify $(BIN)/watchify $(BIN)/watsh:
	npm install

%.js: %.ts $(BIN)/tsc
	$(BIN)/tsc

%.min.js: %.js
	closure-compiler --angular_pass --language_in ECMASCRIPT5 --warning_level QUIET $< >$@

# exclude unidata from bundle and include it separately
build/bundle.js: app.js $(BIN)/browserify
	mkdir -p $(@D)
	$(BIN)/browserify -t browserify-ngannotate -u unidata $< -o $@

build/unidata.js: $(BIN)/browserify
	mkdir -p $(@D)
	$(BIN)/browserify -r unidata -o $@

dev: $(BIN)/browserify $(BIN)/watchify $(BIN)/watsh
	(\
   $(BIN)/watsh 'make site.css' site.less & \
   $(BIN)/tsc -m commonjs -t ES5 -w *.ts & \
   $(BIN)/watchify -t browserify-ngannotate -u unidata app.js -o build/bundle.js -v & \
   wait)
