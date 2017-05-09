FROM node

ADD . package.json
RUN npm install
EXPOSE 8765
ADD . .
CMD ["npm", "start"]
