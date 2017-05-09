FROM node:alpine

ENV DOTENV /config/config.env
VOLUME /config

RUN mkdir /app
COPY . /app

WORKDIR /app
RUN npm install

CMD ["npm", "start"]
