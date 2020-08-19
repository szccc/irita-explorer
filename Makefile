setup:production
	cnpm install

run:
	npm run serve

build:
	npm run build

setup_and_run:setup run

setup_and_build:setup build

production:production_replace revert production_params

production_replace:
	-cp ./productionConfig/productionConfig.js ./src; \
	cp ./productionConfig/images/favicon.png ./public; \
	cp ./productionConfig/lang/* ./lang; \
	cp ./productionConfig/images/* ./src/assets;

revert:
	-git checkout HEAD public/index.html && \
	git checkout HEAD src/style/productization.scss

production_params:
	cp ./productionConfig/productionConfig.js ./src && \
	node build-params.js

pp:revert production_params

