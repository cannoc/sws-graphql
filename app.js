require('dotenv').config({path: process.env['CONFIGFILE'] ? process.env['CONFIGFILE'] : './config.env'});
const express = require('express');
const graphQLHTTP = require('express-graphql');
const DataLoader = require('dataloader');
const Resolvers = require('./schema/resolvers');
const app = express();
const schema = require('./schema');
const bodyParser = require('body-parser');
const PQ = require('./persist');

const loaders = {
  term: new DataLoader(keys => Promise.all(keys.map(Resolvers.GetTerm))),
  course: new DataLoader(keys => Promise.all(keys.map(Resolvers.GetCourse))),
  section: new DataLoader(keys => Promise.all(keys.map(Resolvers.GetSection))),
}

app.use(bodyParser.json());

app.post('/query/new', (req,res,next) => {
  PQ.add(req.body.query, "default"); 
  res.send('success');
});

app.put('/query/:id', (req,res,next) => {
  PQ.update(req.params.id, req.body.query);
  res.send('success');
});

app.post('/query/:queryId', (req,res,next) => {
  if(req.params.queryId && PQ.get(req.params.queryId)) {
    req.body.query = PQ.get(req.params.queryId).query;
  }
  next();
});

app.get('/query/:id', (req,res,next) => {
  res.send(PQ.get(req.params.id));
});

app.get('/queries', (req,res,next) => {
  res.send(PQ.list());
});

app.get('/queries/:username', (req,res,next) => {
  res.send(PQ.list(req.params.username));
});

app.delete('/query/:id', (req,res,next) => {
  PQ.delete(req.params.id);
  res.send('success');
});

app.use('/',
  graphQLHTTP((req, resp, next) => {
    // Loaders for GET one requests, should minimize calls to the API
    const startTime = Date.now();
    return {
      context: {loaders},
      schema,
      graphiql: true,
      pretty: true,
      formatError: error => ({
        message: error.message,
        locations: error.locations,
        stack: error.stack,
        path: error.path
      }),
      extensions({ document, variables, operationName, result }) {
        return { operationName, variables, runTime: (Date.now() - startTime) };
      }
    }
}));


app.listen(3009);
