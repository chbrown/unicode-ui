all: ucd/UnicodeData.txt ucd/Blocks.txt site.css

%.css: %.less
	lessc $< | cleancss --keep-line-breaks --skip-advanced -o $@

ucd/%.txt:
	mkdir -p $(dir $@)
	curl -s http://www.unicode.org/Public/7.0.0/$@ > $@
