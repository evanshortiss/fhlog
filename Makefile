mocha 		= ./node_modules/.bin/mocha
karma 		= ./node_modules/karma/bin/karma
jshint		= ./node_modules/.bin/jshint
linelint 	= ./node_modules/.bin/linelint
browserify 	= ./node_modules/.bin/browserify
lintspaces 	= ./node_modules/.bin/lintspaces

srcFiles = $(shell find ./lib -type f -name '*.js' | xargs)

.PHONY : test

default: format

# Run tests, then build the bundle
build:format
	$(browserify) -s fhlog -e ./lib/LoggerFactory.js -o ./dist/fhlog.js
	@echo "Build succeeded!\n"

# Test files for formatting and errors, then run tests
test:build
	$(mocha) -R spec ./test/*.js
	$(browserify) -e ./test/index.js -o ./test/browser/bundle.js
	$(karma) start

# Test file formatting and for errors
format:
	$(linelint) $(srcFiles) $(testFiles)
	@echo "linelint pass!\n"
	$(lintspaces) -nt -i js-comments -d spaces -s 2 $(srcFiles)
	@echo "lintspaces pass!\n"
	$(jshint) $(srcFiles)
	@echo "JSHint pass!\n"