BIN = node_modules/.bin
DTS = virtual-dom/virtual-dom unorm/unorm \
	jquery/jquery angularjs/angular angularjs/angular-resource

all: site.css build/unidata.min.js build/bundle.min.js favicon.ico
type_declarations: $(DTS:%=type_declarations/DefinitelyTyped/%.d.ts)

$(BIN)/%:
	npm install

type_declarations/DefinitelyTyped/%:
	mkdir -p $(@D)
	curl -s https://raw.githubusercontent.com/chbrown/DefinitelyTyped/master/$* > $@

.INTERMEDIATE: favicon-16.png favicon-32.png
favicon-%.png: logo.psd
	convert $<[0] -resize $*x$* $@
favicon.ico: favicon-16.png favicon-32.png
	convert $^ $@

%.css: %.less
	lessc $< | cleancss --keep-line-breaks --skip-advanced -o $@

%.js: %.ts $(BIN)/tsc type_declarations
	$(BIN)/tsc -m commonjs -t ES5 $<

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
