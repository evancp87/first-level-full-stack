const asyncMySQL = require("../database/connection");

const apiKey = process.env.API_KEY;
const axios = require("axios");

async function getGamesList(req, res) {
  const results = await asyncMySQL(
    `SELECT game.id,
  game.name,
  game.released,
  game.slug,
  game.released,
  game.background_image,
game.rating,
  game.price,
  GROUP_CONCAT(p.name SEPARATOR ', ') AS platforms
FROM games game
INNER JOIN platform_games pg ON game.id = pg.game_id
INNER JOIN platforms p ON pg.platform_id = p.id
GROUP BY game.name;`
  );

  if (results.length > 0) {
    res.status(200).send(results);
    return;
  }

  res.send({ status: 404, reason: "No games found" });
}

// gets individual game

// async function getGameOnWishList(req, res) {
//   console.log("game route ran");
//   const slug = req.params.slug;

//   if (!slug || typeof slug !== "string") {
//     res.status(404).send("No game slug was provided");
//     return;
//   }
//   const results = await asyncMySQL(`SELECT id, slug, name, rating
//                                         FROM games
//                                           WHERE slug LIKE '${slug}';`);

//   if (results.length > 0) {
//     res.status(200).send(results);
//     return;
//   }

//   res.status(404).send("game not found with that slug");
// }

async function getGameOnWishList(req, res) {
  console.log("finding customer and game on wishlist");
  const wishlistId = req.query.wishlistId;
  const userId = req.query.userId;
  console.log(wishlistId, userId);
  if (!userId || isNaN(userId) || !wishlistId || isNaN(wishlistId)) {
    res.status(400).send("Incorrect credentials");
  }

  const query = `
  SELECT
  games.released,
  games.Name AS name,
  games.background_image,
  games.slug,
  games.rating,
  users.name AS user_name
FROM games
JOIN wishlist_games ON wishlist_games.game_id = games.id
JOIN users ON users.user_id = wishlist_games.user_id
WHERE wishlist_games.user_id = ${userId} AND wishlist_games.wishlist_id = ${wishlistId};
  `;

  // SELECT
  //   games.released,
  //   games.Name AS game,
  //   games.background_image,
  //   games.slug,
  //   games.rating,

  //   users.name
  // FROM games
  // JOIN wishlists ON wishlists.game_id = games.id
  // JOIN users ON users.user_id = wishlists.customer_id
  // WHERE wishlists.customer_id = ${userId} AND wishlists.id = ${wishlistId};

  try {
    const results = await asyncMySQL(query);
    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      res.status(404).send("No games found for the specified customer_id");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("There was an internal server error");
  }
}

// platform names
const getPlatforms = async (req, res) => {
  try {
    const results = await asyncMySQL(`select name from platforms`);

    if (results.length > 0) {
      res.status(200).json(results);
    }
    res.status(404).json("no results found");
  } catch (error) {
    console.log("error:", error);
    res.status(500).json("internal server error");
  }
};

// genres
const getGenres = async (req, res) => {
  try {
    const results = await asyncMySQL(`select name from genres`);

    if (results.length > 0) {
      res.status(200).json(results);
    }
    res.status(404).json("no results found");
  } catch (error) {
    console.log("error:", error);
    res.status(500).json("internal server error");
  }
};

// screenshots
const getScreenshots = async (req, res) => {
  try {
    const game_pk = req.params.game_pk;

    if (!game_pk || typeof game_pk !== "string") {
      res.status(404).send("game slug not provided");
    }
    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${game_pk}/screenshots?key=${apiKey}`
    );

    const results = data.results.map((element, index) => {
      return {
        image: element.image,
      };
    });
    console.log(results);
    res.status(200).send(results);
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("internal server error");
  }
};

const getGamesByDate = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const { data } = await axios.get(
      `https://api.rawg.io/api/games?dates=${startDate},${endDate}&key=${apiKey}`
    );

    console.log(data);
    // const filteredResults = data.filter((game) => {
    //   return game.rating >= 3.5;
    // });
    // const results = filteredResults.slice(0, 10);
    res.status(200).send(data);
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("internal server error");
  }
};

const getGameDetail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${slug}?key=${apiKey}`
    );
    const {
      released,
      name,
      background_image,
      rating,
      platforms,
      genres,
      developers,
      description,
      id,
      price,
    } = data;
    console.log(" the data is:", data);
    const results = {
      // released: data.released,
      // name: data.name,
      // background_image: data.background_image,
      // rating: data.rating,
      // platforms: data.platforms,
      // genres: data.genres,
      // developers: data.developers,
      // description: data.description,
      // id: data.id,
      // price: data.price,
      released,
      name,
      background_image,
      rating,
      platforms,
      genres,
      developers,
      description,
      id,
      price,
    };

    res.status(200).send(results);
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("internal server error");
  }
};

// gets game trailers
const getGameTrailers = async (req, res) => {
  try {
    const slug = req.params.slug;

    if (!slug || typeof slug !== "string") {
      res.status(404).send("game slug not provided");
    }

    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${slug}/movies?key=${apiKey}`
    );
    const results = data.results;

    if (results.length > 0) {
      res.status(200).send(results);
    } else {
      res.status(204).send("No game trailers available for the given slug.");
    }

    // return data;
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("internal server error");
  }
};

module.exports = {
  getGamesList,
  getGameOnWishList,
  getPlatforms,
  getGenres,
  getScreenshots,
  getGameDetail,
  getGameTrailers,
  getGamesByDate,
};
