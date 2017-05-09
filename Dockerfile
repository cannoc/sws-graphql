FROM node:alpine

RUN mkdir /app
COPY . /app
WORKDIR /app

RUN npm install
VOLUME /config
ENV DOTENV /config/.env
CMD ["npm", "start"]
