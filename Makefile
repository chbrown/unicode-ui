DTS = virtual-dom/virtual-dom unorm/unorm \
	jquery/jquery angularjs/angular angularjs/angular-resource

all: site.css build/unidata.js build/bundle.js

# it seems Make doesn't count these as .PRECIOUS unless they're an actual target?
type_declarations: $(DTS:%=type_declarations/DefinitelyTyped/%.d.ts)

%.css: %.less
	lessc $< | cleancss --keep-line-breaks --skip-advanced -o $@

node_modules/.bin/tsc node_modules/.bin/browserify node_modules/.bin/watchify:
	npm install

%.js: %.ts | node_modules/.bin/tsc type_declarations
	node_modules/.bin/tsc -m commonjs -t ES5 $<

type_declarations/DefinitelyTyped/%:
	mkdir -p $(@D)
	curl -s https://raw.githubusercontent.com/chbrown/DefinitelyTyped/master/$* > $@

build/unidata.js: | node_modules/.bin/browserify
	node_modules/.bin/browserify -r unidata -o $@

build/bundle.js: app.js | node_modules/.bin/browserify
	mkdir -p $(@D)
	# exclude unidata from bundle and include it separately
	node_modules/.bin/browserify $< -u unidata -o $@

dev: | node_modules/.bin/browserify node_modules/.bin/watchify
	(node_modules/.bin/tsc -m commonjs -t ES5 -w *.ts & \
   node_modules/.bin/watchify -u unidata app.js -o build/bundle.js -v & \
   wait)
