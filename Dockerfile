FROM node:alpine

VOLUME /config

RUN mkdir /app
COPY . /app

WORKDIR /app
RUN npm install

CMD ["npm", "start"]
