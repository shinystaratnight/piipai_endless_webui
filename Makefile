make:
	npm install
	npm run build:prod
	rm -rf /www/*
	cp -r dist/* /www/
