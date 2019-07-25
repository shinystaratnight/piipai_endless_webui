all:
	yarn install
	npm run prod-manager
	npm run prod-client
	npm run prod-candidate
	rm -rf /www/*
	cp -r dist/* /www/

staging:
	yarn install
	npm run stage-manager
	npm run stage-client
	npm run stage-candidate
	rm -rf /www/*
	cp -r dist/* /www/
