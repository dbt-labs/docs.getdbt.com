.PHONY: run install build

run:
	npm start

install:
	npm install

build:
	DOCS_ENV=build npm run build

	# Create per-version redirects... hopefully we can phase these out as
	# search engines de-index these absolute versioned URLs
	cat ../_redirects > build/_redirects
	cat ../_redirects | grep 'docs/' | awk '{ print "/v0.15" $$1 "\t" $$2 "\t" $$3 }' >> build/_redirects
	cat ../_redirects | grep 'docs/' | awk '{ print "/v0.14" $$1 "\t" $$2 "\t" $$3 }' >> build/_redirects
	cat ../_redirects | grep 'docs/' | awk '{ print "/v0.13" $$1 "\t" $$2 "\t" $$3 }' >> build/_redirects
	cat ../_redirects | grep 'docs/' | awk '{ print "/v0.12" $$1 "\t" $$2 "\t" $$3 }' >> build/_redirects
	cat ../_redirects | grep 'docs/' | awk '{ print "/v0.11" $$1 "\t" $$2 "\t" $$3 }' >> build/_redirects
	cat ../_redirects | grep 'docs/' | awk '{ print "/v0.10" $$1 "\t" $$2 "\t" $$3 }' >> build/_redirects

	cat ../_headers > build/_headers
