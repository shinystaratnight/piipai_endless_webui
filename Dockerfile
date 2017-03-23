FROM node:6.10
WORKDIR /code
ADD Makefile /code
RUN npm install --global webpack webpack-dev-server karma-cli protractor typescript
ENTRYPOINT ["./docker-entrypoint.sh"]
