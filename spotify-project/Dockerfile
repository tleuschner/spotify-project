# base image
FROM node:10.13.0

RUN mkdir -p /app
WORKDIR /app
EXPOSE 4200

ENV PATH /app/node_modules/.bin:$PATH

COPY . /app

RUN npm install --silent
RUN npm rebuild node-sass
