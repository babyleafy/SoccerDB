// import the mongodb driver
const { MongoClient } = require('mongodb');

// the mongodb server URL
const dbURL = 'mongodb+srv://erik:B94EIqxKwyChWUVj@soccerdb.xvgbvha.mongodb.net/?retryWrites=true&w=majority';

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;
// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'FIFA' },
    )); // we return the entire connection, not just the DB
    // check that we are connected to the db
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};
/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

const getStats = async (name) => {
  const db = await getDB();
  const results = await db.collection('FifaStats').findOne({
    long_name: {
      $regex: name.split(' ').map(w => `\\b${w}\\b`).join('.*'),
      $options: 'i'
    }
  });
  return results;
};

const getTopStats = async () => {
    const db = await getDB();
    const results = await db.collection('FifaStats').find({}, { overall: 1, long_name: 1 }).sort({ overall: -1 }).toArray();
    return results;
};

module.exports = {
    closeMongoDBConnection,
    getDB,
    connect,
    getStats,
    getTopStats
  };