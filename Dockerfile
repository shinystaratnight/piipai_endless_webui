FROM node:6.10
WORKDIR /code
ADD Makefile /code
RUN npm install --global @angular/cli@6
ENTRYPOINT ["./docker-entrypoint.sh"]
