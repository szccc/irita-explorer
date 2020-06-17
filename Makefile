setup:
	cnpm install && npm run revert  && npm run param $(params)

run:
	npm run serve

build_dev:
	npm run build

build:setup
	npm run build