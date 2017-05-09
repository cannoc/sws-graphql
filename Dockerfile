FROM node:alpine

ENV DOTENV /config/config.env

RUN mkdir /app
COPY . /app

WORKDIR /app
RUN npm install

VOLUME /config

CMD ["npm", "start"]
