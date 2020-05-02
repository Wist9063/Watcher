class database {

  get(id, db, collection) {
    return new Promise(function(resolve, reject) {
      db.db('watcher').collection(collection).find({gID: id}).toArray(function(err, docs) {
        if (err) {
          // Reject the Promise with an error
          return reject(err);
        }
   
        docs = (JSON.parse(JSON.stringify(docs)))[0];
        // Resolve (or fulfill) the promise with data
        return resolve(docs);
      });
    });
  }

}

module.exports = database;