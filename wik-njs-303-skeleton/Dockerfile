FROM node:alpine

RUN apk update

WORKDIR /app
ADD package*.json ./

RUN npm install

ADD . .

CMD npm start
