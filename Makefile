all:
	yarn install
	npm run prod
	rm -rf /www/*
	cp -r dist/* /www/

staging:
	yarn install
	npm run stage
	rm -rf /www/*
	cp -r dist/* /www/
