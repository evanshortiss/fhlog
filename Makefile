mocha 		= ./node_modules/.bin/mocha
jshint		= ./node_modules/.bin/jshint
browserify 	= ./node_modules/.bin/browserify
lintspaces 	= ./node_modules/.bin/lintspaces

srcFiles = $(shell find ./lib -type f -name '*.js' | xargs)

.PHONY : test

default: format

# Run tests, then build the hype JavaScript bundle
build:format
	@make format
	$(browserify) -s fhlog -e ./lib/LoggerFactory.js -o ./dist/fhlog.js
	@echo "Build succeeded!\n"

# Test files for formatting and errors, then run tests
test:build
	$(mocha) -R spec ./test/*.js

# Test file formatting and for errors
format:
	$(lintspaces) -nt -i js-comments -d spaces -s 2 $(srcFiles)
	@echo "lintspaces pass!\n"
	$(jshint) $(srcFiles)
	@echo "JSHint pass!\n"