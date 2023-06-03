const mysql = require('mysql')
const config = require('./config.json')
const NodeCache = require("node-cache");

// Creates MySQL connection using database credential provided in config.json
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));
const dbLib = require('./fifaDB');

// Initialize the cache
const cache = new NodeCache();

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
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// GET /player_id/:player_id
const player_id = async function (req, res) {
  const player_id = req.params.player_id;

  connection.query(`
    SELECT Players.player_id, Players.player_name, Players.club_id, Players.country, Players.date_of_birth,
           Players.position, Players.foot, Players.height_in_cm, Players.market_value_in_eur, Players.highest_market_value_in_eur,
           Players.image_url, Players.last_season, Clubs.club_name
    FROM Players, Clubs
    WHERE player_id = ${player_id} AND Players.club_id = Clubs.club_id
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
    SELECT Players.player_id, Players.player_name, Players.club_id, Players.country, Players.date_of_birth,
          Players.position, Players.foot, Players.height_in_cm, Players.market_value_in_eur, Players.highest_market_value_in_eur,
          Players.image_url, Players.last_season, Clubs.club_name
    FROM Players, Clubs
    WHERE player_name LIKE "%${player_name}%" AND Players.club_id = Clubs.club_id
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/***************************
 * ADVANCED PLAYER ROUTES *
 ***************************/
// GET /top/players
const top_players = async function (req, res) {
  const page = req.query.page;
  const pageSize = req.query.page_size ? req.query.page_size : 10;
  const orderBy = req.params.orderBy ? req.params.orderBy : "goals";

  if (orderBy === "goals" || orderBy === "assists" || orderBy === "red_cards" || orderBy === "yellow_cards" || orderBy === "minutes_played") {
    if (!page) {
      data = cache.get("top_players_" + orderBy);
      if (data == undefined) {
        connection.query(`
          WITH AppearanceData AS (
            SELECT player_id, SUM(${orderBy}) AS ${orderBy}
            FROM Appearances
            GROUP BY player_id
          )
          SELECT Players.player_id, Players.player_name, Clubs.club_name AS club, Players.position, ${orderBy}
          FROM Players NATURAL JOIN AppearanceData JOIN Clubs ON Players.club_id = Clubs.club_id
          ORDER BY ${orderBy} DESC
        `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json([]);
          } else {
            cache.set("top_players_" + orderBy, data)
            res.json(data);
          }
        });
      } else {
        res.json(data);
      }
    } else {
      connection.query(`
        WITH AppearanceData AS (
          SELECT player_id, SUM(${orderBy}) AS ${orderBy}
          FROM Appearances
          GROUP BY player_id
        )
        SELECT Players.player_id, Players.player_name, Clubs.club_name AS club, Players.position, ${orderBy}
        FROM Players NATURAL JOIN AppearanceData JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY ${orderBy} DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else if (orderBy === "height") {
    if (!page) {
      connection.query(`
        SELECT player_id, player_name, Clubs.club_name AS club, Players.position, height_in_cm AS height
        FROM Players JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY height_in_cm DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        SELECT player_id, player_name, Clubs.club_name AS club, Players.position, height_in_cm AS height
        FROM Players JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY height_in_cm DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else if (orderBy === "current_value") {
    if (!page) {
      connection.query(`
        SELECT player_id, player_name, Clubs.club_name AS club, Players.position, market_value_in_eur AS current_value
        FROM Players JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY market_value_in_eur DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        SELECT player_id, player_name, Clubs.club_name AS club, Players.position, market_value_in_eur AS current_value
        FROM Players JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY market_value_in_eur DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else if (orderBy === "highest_value") {
    if (!page) {
      connection.query(`
        SELECT player_id, player_name, Clubs.club_name AS club, Players.position, highest_market_value_in_eur AS highest_value
        FROM Players JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY highest_market_value_in_eur DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        SELECT player_id, player_name, Clubs.club_name AS club, Players.position, highest_market_value_in_eur AS highest_value
        FROM Players JOIN Clubs ON Players.club_id = Clubs.club_id
        ORDER BY highest_market_value_in_eur DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else {
    res.status(400).send(`'${req.params.orderBy}' is not a valid attribute by which to sort players. Valid attributes include 'goals', 'assists', 'red_cards', 'yellow_cards', 'minutes_played', 'height', 'current_value', and 'highest_value'.`);
  }
}

// GET /player_goals
const player_goals = async function (req, res) {
  const player_id = req.params.player_id;

  connection.query(`
    WITH Goals AS (
      SELECT player_id, player_club_id, season, SUM(goals) AS goal_count
      FROM Appearances NATURAL JOIN Games
      WHERE player_id = ${player_id}
      GROUP BY player_id, player_club_id, season
    )
    SELECT player_id, player_name, club_name, season, goal_count
    FROM (Players NATURAL JOIN Goals) JOIN Clubs on player_club_id = Clubs.club_id
    ORDER BY season DESC, club_name ASC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
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
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// GET /club_id/:club_id
const club_id = async function (req, res) {
  const club_id = req.params.club_id;

  connection.query(`
    SELECT *
    FROM Clubs
    WHERE club_id = ${club_id}
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
    FROM Clubs
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
  const orderBy = req.params.orderBy ? req.params.orderBy : "total_goals";
  if (orderBy === "avg_goals") {
    if (!page) {
      data = cache.get("avg_goals");
      if (data == undefined) {
        connection.query(`
          WITH HomeGoals AS (
            SELECT player_club_id AS club_id, SUM(goals) AS club_goals, COUNT(DISTINCT Games.game_id) AS num_games
            FROM Appearances JOIN Games ON Appearances.player_club_id = Games.home_club_id AND Appearances.game_id = Games.game_id
            GROUP BY player_club_id
          ),
          AwayGoals AS (
            SELECT player_club_id AS club_id, SUM(goals) AS club_goals, COUNT(DISTINCT Games.game_id) AS num_games
            FROM Appearances JOIN Games ON Appearances.player_club_id = Games.away_club_id AND Appearances.game_id = Games.game_id
            GROUP BY player_club_id
          ),
          ClubNames AS (
            SELECT club_id, club_name
            FROM Clubs
          )
          SELECT HomeGoals.club_id, club_name, ((HomeGoals.club_goals + AwayGoals.club_goals) / (HomeGoals.num_games + AwayGoals.num_games)) AS avg_goals
          FROM (HomeGoals JOIN AwayGoals ON HomeGoals.club_id = AwayGoals.club_id) JOIN ClubNames ON HomeGoals.club_id = ClubNames.club_id
          GROUP BY club_id, club_name
          ORDER BY avg_goals DESC
        `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json([]);
          } else {
            cache.set("avg_goals", data);
            res.json(data);
          }
        });
      } else {
        res.json(data);
      }
    } else {
      connection.query(`
        WITH HomeGoals AS (
          SELECT player_club_id AS club_id, SUM(goals) AS club_goals, COUNT(DISTINCT Games.game_id) AS num_games
          FROM Appearances JOIN Games ON Appearances.player_club_id = Games.home_club_id AND Appearances.game_id = Games.game_id
          GROUP BY player_club_id
        ),
        AwayGoals AS (
          SELECT player_club_id AS club_id, SUM(goals) AS club_goals, COUNT(DISTINCT Games.game_id) AS num_games
          FROM Appearances JOIN Games ON Appearances.player_club_id = Games.away_club_id AND Appearances.game_id = Games.game_id
          GROUP BY player_club_id
        ),
        ClubNames AS (
          SELECT club_id, club_name
          FROM Clubs
        )
        SELECT HomeGoals.club_id, club_name, ((HomeGoals.club_goals + AwayGoals.club_goals) / (HomeGoals.num_games + AwayGoals.num_games)) AS avg_goals
        FROM (HomeGoals JOIN AwayGoals ON HomeGoals.club_id = AwayGoals.club_id) JOIN ClubNames ON HomeGoals.club_id = ClubNames.club_id
        GROUP BY club_id, club_name
        ORDER BY avg_goals DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      })
    }
  } else if (orderBy === "total_goals") {
    if (!page) {
      data = cache.get("total_goals");
      if (data == undefined) {
        connection.query(`
          WITH HomeGoals AS (
            SELECT player_club_id AS club_id, SUM(goals) AS club_goals
            FROM Appearances JOIN Games ON Appearances.player_club_id = Games.home_club_id AND Appearances.game_id = Games.game_id
            GROUP BY player_club_id
          ),
          AwayGoals AS (
            SELECT player_club_id AS club_id, SUM(goals) AS club_goals
            FROM Appearances JOIN Games ON Appearances.player_club_id = Games.away_club_id AND Appearances.game_id = Games.game_id
            GROUP BY player_club_id
          ),
          ClubNames AS (
            SELECT club_id, club_name
            FROM Clubs
          )
          SELECT HomeGoals.club_id, club_name, ((HomeGoals.club_goals) + (AwayGoals.club_goals)) AS total_goals
          FROM (HomeGoals JOIN AwayGoals ON HomeGoals.club_id = AwayGoals.club_id) JOIN ClubNames ON HomeGoals.club_id = ClubNames.club_id
          GROUP BY club_id, club_name
          ORDER BY total_goals DESC
        `, (err, data) => {
          if (err || data.length === 0) {
            console.log(err);
            res.json([]);
          } else {
            cache.set("total_goals", data);
            res.json(data);
          }
        });
      } else {
        res.json(data);
      }
    } else {
      connection.query(`
        WITH HomeGoals AS (
          SELECT player_club_id AS club_id, SUM(goals) AS club_goals
          FROM Appearances JOIN Games ON Appearances.player_club_id = Games.home_club_id AND Appearances.game_id = Games.game_id
          GROUP BY player_club_id
        ),
        AwayGoals AS (
          SELECT player_club_id AS club_id, SUM(goals) AS club_goals
          FROM Appearances JOIN Games ON Appearances.player_club_id = Games.away_club_id AND Appearances.game_id = Games.game_id
          GROUP BY player_club_id
        ),
        ClubNames AS (
          SELECT club_id, club_name
          FROM Clubs
        )
        SELECT HomeGoals.club_id, club_name, ((HomeGoals.club_goals) + (AwayGoals.club_goals)) AS total_goals
        FROM (HomeGoals JOIN AwayGoals ON HomeGoals.club_id = AwayGoals.club_id) JOIN ClubNames ON HomeGoals.club_id = ClubNames.club_id
        GROUP BY club_id, club_name
        ORDER BY total_goals DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      })
    }
  } else if (orderBy === "value") {
    if (!page) {
      connection.query(`
        WITH PlayerValues AS (
          SELECT player_id, club_id, market_value_in_eur
          FROM Players
        ), ClubValues AS (
          SELECT club_id, club_name
          FROM Clubs
          WHERE squad_size > 0
        )
        SELECT ClubValues.club_name, ClubValues.club_id, SUM(PlayerValues.market_value_in_eur) AS value
        FROM ClubValues JOIN PlayerValues ON ClubValues.club_id = PlayerValues.club_id
        GROUP BY ClubValues.club_id
        ORDER BY value DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        WITH PlayerValues AS (
          SELECT player_id, club_id, market_value_in_eur
          FROM Players
        ), ClubValues AS (
          SELECT club_id, club_name
          FROM Clubs
          WHERE squad_size > 0
        )
        SELECT ClubValues.club_name, ClubValues.club_id, SUM(PlayerValues.market_value_in_eur) AS club_value
        FROM ClubValues JOIN PlayerValues ON ClubValues.club_id = PlayerValues.club_id
        GROUP BY ClubValues.club_id
        ORDER BY value DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      })
    }
  } else if (orderBy === "knockout_trophies") {
    if (!page) {
      connection.query(`
        WITH HomeTrophies AS (
          SELECT home_club_id, COUNT(*) AS num_trophies
          FROM Games
          WHERE home_club_goals > away_club_goals AND round = 'Final'
          GROUP BY home_club_id
        ), AwayTrophies AS (
          SELECT away_club_id, COUNT(*) AS num_trophies
          FROM Games
          WHERE home_club_goals < away_club_goals AND round = 'Final'
          GROUP BY away_club_id
        )
        SELECT C.club_id, C.club_name, (IFNULL(HomeTrophies.num_trophies, 0) + IFNULL(AwayTrophies.num_trophies, 0)) AS knockout_trophies
        FROM Clubs C LEFT OUTER JOIN (HomeTrophies JOIN AwayTrophies ON HomeTrophies.home_club_id = AwayTrophies.away_club_id) ON C.club_id = HomeTrophies.home_club_id
        ORDER BY knockout_trophies DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        WITH HomeTrophies AS (
          SELECT home_club_id, COUNT(*) AS num_trophies
          FROM Games
          WHERE home_club_goals > away_club_goals AND round = 'Final'
          GROUP BY home_club_id
        ), AwayTrophies AS (
          SELECT away_club_id, COUNT(*) AS num_trophies
          FROM Games
          WHERE home_club_goals < away_club_goals AND round = 'Final'
          GROUP BY away_club_id
        )
        SELECT C.club_id, C.club_name, (IFNULL(HomeTrophies.num_trophies, 0) + IFNULL(AwayTrophies.num_trophies, 0)) AS knockout_trophies
        FROM Clubs C LEFT OUTER JOIN (HomeTrophies JOIN AwayTrophies ON HomeTrophies.home_club_id = AwayTrophies.away_club_id) ON C.club_id = HomeTrophies.home_club_id
        ORDER BY knockout_trophies DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else if (orderBy) {
    if (!page) {
      connection.query(`
        SELECT club_id, club_name, ${orderBy}
        FROM Clubs
        ORDER by ${orderBy} DESC
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    } else {
      connection.query(`
        SELECT club_id, club_name, ${orderBy}
        FROM Clubs
        ORDER by ${orderBy} DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `, (err, data) => {
        if (err || data.length === 0) {
          console.log(err);
          res.json([]);
        } else {
          res.json(data);
        }
      });
    }
  } else {
    res.status(400).send(`'${req.params.orderBy}' is not a valid attribute by which to sort clubs.`);
  }
}

//GET /clubs/market_value/:club_id
const club_market_value = async function (req, res) {
  const club_id = req.params.club_id;
  connection.query(`
    WITH PlayerValues AS (
      SELECT player_id, club_id, market_value_in_eur
      FROM Players
    ), ClubValues AS (
      SELECT club_id, club_name
      FROM Clubs
      WHERE squad_size > 0
    )
    SELECT ClubValues.club_name, ClubValues.club_id, SUM(PlayerValues.market_value_in_eur) AS value
    FROM ClubValues
    JOIN PlayerValues ON ClubValues.club_id = PlayerValues.club_id
    WHERE ClubValues.club_id = ${club_id}
    GROUP BY ClubValues.club_id;  
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

// GET /top_players_in_clubs
const top_players_in_clubs = async function (req, res) {
  connection.query(`
    WITH AverageGamesPerPlayerAndClub AS (
      SELECT player_id, player_club_id, SUM(goals) AS sum_player_goals
      FROM Appearances
      GROUP BY player_id, player_club_id
      ORDER BY sum_player_goals DESC
    ), MAXES AS (
      SELECT *
      FROM AverageGamesPerPlayerAndClub
      GROUP BY player_club_id
    )
    SELECT C.club_id, C.club_name, P.player_id, P.player_name, sum_player_goals
    FROM MAXES NATURAL JOIN Players P RIGHT OUTER JOIN Clubs C on MAXES.player_club_id = C.club_id
    ORDER BY sum_player_goals DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });
}

const players_fifa = async (req, res) => {
  try {
    const response = await dbLib.getStats(req.params.name);
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

const top_fifa = async (req, res) => {
  try {
    const response = await dbLib.getTopStats();
    res.status(200).json({ data: response });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}


module.exports = {
  players,
  player_id,
  player_name,
  top_players,
  player_goals,
  clubs,
  club_id,
  club_name,
  top_clubs,
  players_fifa,
  top_fifa,
  top_players_in_clubs,
  club_market_value
}
