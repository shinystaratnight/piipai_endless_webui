FROM node:current
WORKDIR /code
ADD Makefile /code
RUN npm install --global yarn
ENTRYPOINT ["./docker-entrypoint.sh"]
