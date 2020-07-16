setup:production
	cnpm install

run:
	npm run serve

build:
	npm run build

setup_and_run:setup run

setup_and_build:setup build

production:
	node build-params.js