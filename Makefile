all: install build

install: node packages

build: prod

#Download node js
node:
	curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
	sudo apt-get install -y nodejs

#Download npm packages
packages: node
	npm install --global webpack webpack-dev-server karma-cli protractor typescript
	npm install

prod:
	npm run build:prod
	mv dist/ www/
	rm -rf dist/

build-for-docker:
	npm install
	npm run build:prod
	rm -rf /www/*
	mv dist/* /www/
