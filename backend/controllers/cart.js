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
  } = req.body;

  const addedGameIndex = req.games.findIndex((game) => game.id === id);

  if (addedGameIndex > -1) {
    res.send("game already added");
    return;
  }

  const newGame = {
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

  req.games.push(newGame);
  console.log("New game added:", newGame);

  res.sendStatus(200);
}

// deleting single game from cart
function deleteGame(req, res) {
  console.log("game deleted route ran");

  // const gameSlug = req.params.slug;
  const { id } = req.body;

  const gameToDelete = req.games.findIndex((game) => game.id === id);
  console.log("the index is", gameToDelete);
  console.log("the game is", gameSlug);

  if (gameToDelete === -1) {
    res.status(404).send("Game not found");
    return;
  }

  req.games.splice(gameToDelete, 1);

  res.status(200).send("Game deleted successfully");
}

function clearCart(req, res) {
  console.log("game deleted route ran");

  // const gameSlug = req.params.slug;
  const { id } = req.body;

  // const gameToDelete = req.games.findIndex((game) => game.id === id);
  // console.log("the index is", gameToDelete);
  // console.log("the game is", gameSlug);

  // if (gameToDelete === -1) {
  //   res.status(404).send("Game not found");
  //   return;
  // }

  // req.games.splice(gameToDelete, 1);

  // res.status(200).send("Game deleted successfully");
}

// TODO: send email based on cart items
// TODO clear items?
// TODO quantity?
// TODO: total?

// updating
module.exports = {
  getGamesList,
  getGame,
  addGame,
  deleteGame,
};
