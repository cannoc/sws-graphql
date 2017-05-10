const queryFile = process.env.QueryFile ? process.env.QueryFile : './queries.json';
var PersistedQueries = {};
const fs = require('fs');

if(fs.existsSync(queryFile)){
  PersistedQueries = require(queryFile);
  if(Object.keys(PersistedQueries).length === 0) {
    PersistedQueries = { nextId: 0 };
  } else if(!PersistedQueries.nextId) {
    PersistedQueries.nextId = Math.max(Object.keys(PersistedQueries)) + 1 || 0;
  }
  updatePersistFile();
} else {
  fs.writeFile(queryFile, JSON.stringify({nextId:0}), function (err) {
    if(err) return console.log("error creating persist file", err);
    PersistedQueries = require(queryFile);
    updatePersistFile();
  });
}

function updatePersistFile() {
   fs.writeFile(queryFile, JSON.stringify(PersistedQueries), function (err) {
      if (err) return console.log('failed to update queries', err);
    });
}

const PQ = {
  list: (username) => {
    if(username) {
      let result = {};
      for(q in PersistedQueries) {
        if(PersistedQueries.hasOwnProperty(q) && PersistedQueries[q].user == username) {
          result[q] = PersistedQueries[q];
        }
      }
      return result;
    } else {
      return PersistedQueries;
    }
  },
  get: (id) => PersistedQueries[id],
  add: (query, username) => {
    let nextId = PersistedQueries.nextId++; 
    PersistedQueries = Object.assign({}, PersistedQueries, {[nextId]: {query: query, user: username}});
    updatePersistFile();
  },
  update: (id, query) => {
    if(PersistedQueries[id]) {
      PersistedQueries[id].query = query;
      updatePersistFile(); 
    }
  },
  delete: (id) => {
    delete PersistedQueries[id];
    updatePersistFile();
  }
};

module.exports = PQ;
