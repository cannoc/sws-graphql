const queryFile = './queries.json';
var PersistedQueries = require(queryFile);
const fs = require('fs');

function updatePersistFile() {
   fs.writeFile('persisted/queries.json', JSON.stringify(PersistedQueries), function (err) {
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
