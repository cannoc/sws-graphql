FROM node:alpine

ENV DOTENV /config/config.env

VOLUME /config

RUN mkdir /app
COPY . /app

COPY config.env.example /config/config.env.example

WORKDIR /app
RUN npm install


CMD ["npm", "start"]
