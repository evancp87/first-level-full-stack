const axios = require("axios");
const express = require("express");
const app = express();
require("dotenv").config();
const apiKey = process.env.API_KEY;
const games = require("./data.json");
const addRouter = require("./routes/games/add");
const deleteRouter = require("./routes/games/delete");
const updateRouter = require("./routes/games/update");
const getRouter = require("./routes/games/get");
const { getCachedGames, cacheGames } = require("../");
const asyncMySQL = require("../database/connection");
app.us(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 6001;

// app.use((req, res, next) => {
//   req.games = games;
//   // res.status(200).send(games);
//   next();
// });

app.use(async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?key=${apiKey}`
    );
    req.games = data.results;
    next();
  } catch (error) {
    console.error("Error fetching games data:", error);
    res.sendStatus(500);
  }
});

app.use(async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?key=${apiKey}`
    );
    req.games = data.results;
    next();
  } catch (error) {
    console.error("Error fetching games data:", error);
    res.sendStatus(500);
  }
});

app.use(function myLogger(req, res, next) {
  console.log("logged");
  next();
});

// game data

app.use(async (req, res, next) => {
  try {
    // caching api call so doesn't have to be repeated if games are in cache
    const cachedGames = getCachedGames();

    if (
      cachedGames !== null &&
      cachedGames !== undefined &&
      cachedGames.length > 0
    ) {
      console.log("Fetching games from cache...");
      return cachedGames;
    } else {
      let results = [];
      // ierates over paginated games data
      for (let i = 0; i < 30; i++) {
        const { data } = await axios.get(
          ` https://api.rawg.io/api/games?key=${api}&page=${i + 1}`
        );

        results = [...results, ...data.results];
      }
      results = results.map((element, index) => ({
        ...element,
        // sets liked property on each game
        liked: false,
      }));
      console.log("Fetching games from API...");
      cacheGames(results);
      // TODO: change to attaching to req

      res.send(results);
      next();
    }
  } catch (error) {
    console.log("error:", error);
  }
});

app.use(async (req, res, next, startDate, endDate) => {
  try {
    // Will take a start date and end date at point of dispatch to the store
    const { data } = await axios.get(
      `https://api.rawg.io/api/games?dates=${startDate},${endDate}&key=${api}`
    );
    // gets games within date range that have rating of over 3.5. I found 4 and 4.5 too narrow
    const filteredResults = data.results.filter((game) => {
      return game.rating >= 3.5;
    });
    const results = filteredResults.slice(0, 10);
    // TODO: change to attaching to req
    res.send(results);
    next();
  } catch (error) {
    console.log("error:", error);
  }
});

// genres
app.use(async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/genres?key=${api}`
    );
    // TODO: change to attaching to req

    res.send(data.results);

    next();
  } catch (error) {
    console.log("error:", error);
  }
});

// platform names
app.use(async (req, res, next) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/platforms?key=${api}`
    );
    // TODO: change to attaching to req

    res.send(data.results);
  } catch (error) {
    console.log("error:", error);
  }
});

// screenshots
app.use(async (req, res, next, game_pk) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${game_pk}/screenshots?key=${api}`
    );
    // TODO: change to attaching to req

    res.send(data.results);
  } catch (error) {
    console.log("error:", error);
  }
});

// Get details of a single game.
app.use(async (req, res, next, slug) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${slug}?key=${api}`
    );
    // TODO: change to attaching to req

    res.send(data);
  } catch (error) {
    console.log("error:", error);
  }
});

// Get a list of game trailers. Nb only found one game so far with a trailer - GTA V
app.use(async (req, res, next, slug) => {
  try {
    const { data } = await axios.get(
      `https://api.rawg.io/api/games/${slug}/movies?key=${api}`
    );
    res.send(data.results);
  } catch (error) {
    console.log("error:", error);
  }
});

app.use("/games/add", addRouter);
app.use("/games/delete", deleteRouter);
app.use("/games/update", updateRouter);
app.use("/games/get", getRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
