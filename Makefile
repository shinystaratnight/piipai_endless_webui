all:
	npm install
	npm run prod
	rm -rf /www/*
	cp -r dist/* /www/

staging:
	npm install
	npm run stage
	rm -rf /www/*
	cp -r dist/* /www/
