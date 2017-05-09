FROM node:alpine

ENV DOTENV /config/config.env

VOLUME /config

RUN mkdir /app
COPY . /app

WORKDIR /app

RUN cp config.env.example /config/config.env.example

RUN npm install


CMD ["npm", "start"]
