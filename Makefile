all:
	npm install
	ng build --prod
	rm -rf /www/*
	cp -r dist/* /www/
