all:
	npm install
	ng run build --prod
	rm -rf /www/*
	cp -r dist/* /www/
