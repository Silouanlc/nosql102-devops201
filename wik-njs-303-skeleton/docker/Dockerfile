ARG SRV_PORT=8080
FROM node:8-jessie
WORKDIR /project
COPY ./ /project
RUN npm install
ENV REDIS_PORT=6379 REDIS_HOST="localhost" REDIS_USER="root" REDIS_PASSWD="root" SERVER_PORT=${SRV_PORT}
EXPOSE ${SRV_PORT}
CMD npm start