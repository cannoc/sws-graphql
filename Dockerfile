FROM node:alpine

ENV DOTENV /config/config.env

RUN mkdir /app
COPY . /app

VOLUME /config
COPY config.env.example /config

WORKDIR /app

RUN npm install

CMD ["npm", "start"]
