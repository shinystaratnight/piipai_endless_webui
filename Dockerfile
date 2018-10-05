FROM node:10.11
WORKDIR /code
ADD Makefile /code
RUN npm install --global @angular/cli@6
ENTRYPOINT ["./docker-entrypoint.sh"]
