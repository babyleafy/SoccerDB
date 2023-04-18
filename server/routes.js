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
const players = async function (req, res) {
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

// GET /player_id/:player_id
const player_id = async function (req, res) {
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

// GET /player_name/:player_name
const player_name = async function (req, res) {
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

/******************
 * CLUBS ROUTES *
 ******************/

// GET /clubs
const clubs = async function (req, res) {
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

// GET /club_id/:club_id
const club_id = async function (req, res) {
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

// GET /club_name/:club_name
const club_name = async function (req, res) {
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


/************************
 * ADVANCED CLUB ROUTES *
 ************************/

// GET /top_clubs/:orderBy
const top_clubs = async function (req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ? req.query.page_size : 10;
  const orderBy = req.query.orderBy ? req.query.orderBy : "goals";
  if (orderBy === "goals") {
    if (!page) {
      connection.query(`
      WITH HomeGoals AS (
        SELECT player_club_id AS club_id, SUM(goals) AS club_goals
        FROM Appearances JOIN Games ON Appearances.club_id = Games.home_club_id AND Appearances.game_id = Games.game_id
        GROUP BY player_club_id, game_id
      ), 

      AwayGoals AS (
        SELECT player_club_id AS club_id, SUM(goals) AS club_goals
        FROM Appearances JOIN Games ON Appearances.club_id = Games.away_club_id AND Appearances.game_id = Games.game_id
        GROUP BY player_club_id, game_id
      )
      SELECT club_id, AVG(HomeGoals.club_goals) AS avg_home_goals, AVG(AwayGoals.club_goals) AS avg_away_goals
      FROM HomeGoals JOIN AwayGoals ON HomeGoals.club_id = AwayGoals.club_id
      GROUP BY club_id
      ORDER BY avg_home_goals DESC, avg_away_goals DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
      WITH HomeGoals AS (
        SELECT player_club_id AS club_id, SUM(goals) AS club_goals
        FROM Appearances JOIN Games ON Appearances.club_id = Games.home_club_id AND Appearances.game_id = Games.game_id
        GROUP BY player_club_id, game_id
      ), 

      AwayGoals AS (
        SELECT player_club_id AS club_id, SUM(goals) AS club_goals
        FROM Appearances JOIN Games ON Appearances.club_id = Games.away_club_id AND Appearances.game_id = Games.game_id
        GROUP BY player_club_id, game_id
      )
      SELECT club_id, AVG(HomeGoals.club_goals) AS avg_home_goals, AVG(AwayGoals.club_goals) AS avg_away_goals
      FROM HomeGoals JOIN AwayGoals ON HomeGoals.club_id = AwayGoals.club_id
      GROUP BY club_id
      ORDER BY avg_home_goals DESC, avg_away_goals DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json({});
        } else {
          res.json(data);
        }
      })
    }
  } else if (orderBy === "value") {
    const page = req.query.page;
    const pageSize = req.query.page_size ? req.query.page_size : 10;
    const orderBy = req.query.orderBy ? req.query.orderBy : "goals";
    if (orderBy === "goals") {
      if (!page) {
        connection.query(`
      WITH PlayerValues AS (
        SELECT player_id, club_id, market_value_in_eur
      FROM Players
      WHERE last_season >= {year}
      ), ClubValues AS (
        SELECT club_id, club_name
      FROM Clubs
      WHERE squad_size > 0
      ),

      SELECT ClubValues.club_name, SUM(PlayerValues.market_value_in_eur) AS club_value
      FROM ClubValues JOIN PlayerValues ON ClubValues.club_id = PlayerValues.club_id
      GROUP BY ClubValues.club_id
      ORDER BY club_value DESC;
      `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        });
      } else {
        connection.query(`
      WITH PlayerValues AS (
        SELECT player_id, club_id, market_value_in_eur
      FROM Players
      WHERE last_season >= {year}
      ), ClubValues AS (
        SELECT club_id, club_name
      FROM Clubs
      WHERE squad_size > 0
      ),

      SELECT ClubValues.club_name, SUM(PlayerValues.market_value_in_eur) AS club_value
      FROM ClubValues JOIN PlayerValues ON ClubValues.club_id = PlayerValues.club_id
      GROUP BY ClubValues.club_id
      ORDER BY club_value DESC;
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        })
      }
      if (!page) {
        connection.query(`
    SELECT Songs.song_id, Songs.title, Albums.album_id, Albums.title as album, Songs.plays
    FROM Songs, Albums
    WHERE Songs.album_id = Albums.album_id
    ORDER BY {orderBy} DESC
    `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        });
      } else {
        connection.query(`
    SELECT Songs.song_id, Songs.title, Albums.album_id, Albums.title as album, Songs.plays
    FROM Songs, Albums
    WHERE Songs.album_id = Albums.album_id
    ORDER BY plays DESC
    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json({});
          } else {
            res.json(data);
          }
        })
      }
    }
  }
}

