// gets game list

function getGamesList(req, res) {
  console.log("route ran");
  const games = req.games;
  res.send(games);
}

// gets individual game
function getGame(req, res) {
  console.log("getting individual game route ran");
  const _games = [...req.games];
  const gameSlug = req.params.slug;
  console.log("the game slug is", gameSlug);
  const game = _games.find((game) => {
    return game.slug === gameSlug;
  });
  console.log("the game is", game);

  if (!game) {
    res.status(404).send("Couldn't find that game");
    return;
  }

  res.send(game);
}

// adds a game
function addGame(req, res) {
  console.log("add game route ran");

  const { name, rating, playtime, slug } = req.body;

  const addedGameIndex = req.games.findIndex((game) => game.slug === slug);

  if (addedGameIndex > -1) {
    res.send("game already added");
    return;
  }

  const newGame = {
    name,
    rating,
    playtime,
    slug,
  };

  req.games.push(newGame);
  console.log("New game added:", newGame);

  res.sendStatus(200);
}

// deleting
function deleteGame(req, res) {
  console.log("game deleted route ran");

  const gameSlug = req.params.slug;

  const gameToDelete = req.games.findIndex((game) => game.slug === gameSlug);
  console.log("the index is", gameToDelete);
  console.log("the game is", gameSlug);

  if (gameToDelete === -1) {
    res.status(404).send("Game not found");
    return;
  }

  req.games.splice(gameToDelete, 1);

  res.status(200).send("Game deleted successfully");
}

// updating
function updateGame(req, res) {
  console.log("update game route ran");

  const gameSlug = req.params.slug;
  console.log(gameSlug);

  if (!gameSlug) {
    res.send("couldn't find that game");
    return;
  }

  const gameToUpdate = req.games.findIndex((game) => {
    return game.slug === gameSlug;
  });

  console.log(gameToUpdate);
  const { slug, name, rating, playtime } = req.body;

  if (gameToUpdate === -1) {
    res.send("not found");
  }
  if (name) {
    req.games[gameToUpdate].name = name;
  }

  if (rating) {
    req.games[gameToUpdate].rating = rating;
  }
  if (playtime) {
    req.games[gameToUpdate].playtime = playtime;
  }
  const updatedGame = req.games[gameToUpdate];

  res.status(200).send(updatedGame);
}

// TODO - create routes for these

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

module.exports = {
  getGamesList,
  getGame,
  addGame,
  deleteGame,
  updateGame,
};
