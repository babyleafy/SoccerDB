const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * PLAYER ROUTES *
 ******************/

// GET /players
const players = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Players
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /player/:player_id
const player = async function(req, res) {
  const player_id = req.params.player_id;

  connection.query(`
  SELECT *
  FROM Players
  WHERE player_id = "${player_id}"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// GET /player/:player_name
const player = async function(req, res) {
  const player_name = req.params.player_name;

  connection.query(`
  SELECT *
  FROM Players
  WHERE player_name LIKE "%${player_name}%"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /clubs
const clubs = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Clubs
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// GET /club/:club_id
const club = async function(req, res) {
  const club_id = req.params.player_id;

  connection.query(`
  SELECT *
  FROM Clubs
  WHERE club_id = "${club_id}"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// GET /club/:club_name
const club = async function(req, res) {
  const club_name = req.params.club_name;

  connection.query(`
  SELECT *
  FROM Players
  WHERE club_name LIKE "%${club_name}%"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}
