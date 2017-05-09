if(process.env['DOTENV']){
  console.log("ENV FOUND", process.env['DOTENV']);
  require('dotenv').config({path: process.env['DOTENV']});
} else {
  require('dotenv').config();
}
const express = require('express');
const graphQLHTTP = require('express-graphql');
const DataLoader = require('dataloader');
const Resolvers = require('./schema/resolvers');
const app = express();
const schema = require('./schema');


app.use(graphQLHTTP(req => {
  // Loaders for GET one requests, should minimize calls to the API
  const loaders = {
    term: new DataLoader(
      keys => {
        return Promise.all(keys.map(Resolvers.GetTerm));
      }
    ),
    course: new DataLoader(
      keys => {
        return Promise.all(keys.map(Resolvers.GetCourse));
      }
    ),
    section: new DataLoader(
      keys => {
        return Promise.all(keys.map(Resolvers.GetSection));
      }
    )
  }
  return {
    context: {loaders},
    schema,
    graphiql: true
  }

}));

app.listen(3009);
