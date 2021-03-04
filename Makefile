all: test

# Run unit-tests
test:
	for i in test/*-test.rb; do "$$i"; done

.PHONY: test
