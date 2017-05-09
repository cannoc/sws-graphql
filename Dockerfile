FROM node:alpine

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install
VOLUME /config

COPY /app/config.env.example /config

ENV DOTENV /config/config.env
CMD ["npm", "start"]
