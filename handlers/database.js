class database {

  get(id, db, collection) {
    return new Promise(function(resolve, reject) {
      db.db(process.env.WATCHER_DB).collection(collection).find({gID: id}).toArray(function(err, docs) {
        if (err) return reject(err);
        docs = (JSON.parse(JSON.stringify(docs)))[0];
        return resolve(docs);
      });
    }).catch((e) => {throw e;});
  }

  update(id, db, collection, data) {
    return new Promise(function(resolve, reject) {
      db.db(process.env.WATCHER_DB).collection(collection).updateOne({gID: id}, {$set: data}, function(err, r) {
        if (err) return reject(err);
        return resolve(r.modifiedCount); // returns modified count 
      });
    }).catch((e) => {throw e;});
  }

  insert(db, collection, data) {
    return new Promise(function(resolve, reject) {
      db.db(process.env.WATCHER_DB).collection(collection).insertOne(data, function(err, r) {
        if (err) return reject(err);
        return resolve(r.modifiedCount); // returns modified count 
      });
    }).catch((e) => {throw e;});
  }

  delete(db, collection, data) {
    return new Promise(function(resolve, reject) {
      db.db(process.env.WATCHER_DB).collection(collection).deleteOne(data, function(err, r) {
        if (err) return reject(err);
        return resolve(r.modifiedCount); // returns modified count 
      });
    }).catch((e) => {throw e;});
  }

}

module.exports = database;