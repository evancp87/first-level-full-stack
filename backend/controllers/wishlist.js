function getWishLists(req, res) {
  console.log("route ran");
  res.send(req.wishlists);
}

function createWishlist(req, res) {
  const wishListId = req.params.id;
  const { title, games, id } = req.body;

  const _wishlists = [...req.wishlists];

  const wishlistItem = _wishlists.find((list) => list.id === wishListId);

  // Check for existing wishlist
  if (wishlistItem) {
    res.send("There is already a wishlist with this id");
    return;
  }

  if (Number.isNaN(id) || typeof id !== "number") {
    return res.send(404);
  }
  const newWishlist = {
    title,
    games,
    id,
  };

  req.wishlists.push(newWishlist);

  res.sendStatus(200);
}

function getWishlist(req, res) {
  const id = req.params.id;

  if (Number.isNaN(id) || typeof id !== "number") {
    return res.send(404);
  }
  const _wishlists = [...req.wishlists];

  const wishlist = _wishlists.find((list) => list.id === id);

  if (!list) {
    return res.send(404);
  }
  res.send(wishlist);
}

const deleteWishlist = (req, res) => {
  const id = req.params.id;

  const _wishlists = [...req.wishlists];
  const wishlistToDelete = _wishlists.findIndex((list) => list.id === id);

  // sanitising the query
  if (Number.isNaN(id) || typeof id !== "number") {
    return res.send(404);
  }

  // check if wishlist already deleted
  if (indexOf === -1) {
    res.send(
      "The wishlist with that id couldn't be found, perhaps it was already deleted."
    );
    res.sendStatus(404);
    return;
  }

  _wishlists.splice(wishlistToDelete, 1);
  req.wishlists = _wishlists;

  res.send("game deleted successfully");
};

const updateWishlist = (req, res) => {
  const id = req.params.id;
  const { name, games } = req.body;
  if (id === -1) {
    res.sendStatus(404).send("We couldn't find a game with that id");
  }

  const wishlistToUpdate = req.wishlists.findIndex((list) => list.id === id);

  if (name) {
    req.wishlists[wishlistToUpdate].name = name;
  }

  if (games) {
    req.wishlists[wishlistToUpdate].games = games;
  }
  res.sendStatus(200);
};

// TODO- adding games, removing games, etc...

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

module.exports = {
  getWishLists,
  getWishlist,
  createWishlist,
  deleteWishlist,
  updateWishlist,
};

// // gets game list

// function getGamesList(req, res) {
//   console.log("route ran");
//   const games = req.games;
//   res.send(games);
// }

// // gets individual game
// function getGame(req, res) {
//   console.log("getting individual game route ran");
//   const _games = [...req.games];
//   const gameSlug = req.params.slug;
//   console.log("the game slug is", gameSlug);
//   const game = _games.find((game) => {
//     return game.slug === gameSlug;
//   });
//   console.log("the game is", game);

//   if (!game) {
//     res.status(404).send("Couldn't find that game");
//     return;
//   }

//   res.send(game);
// }

// // adds a game
// function addGame(req, res) {
//   console.log("add game route ran");

//   const { name, rating, playtime, slug } = req.body;

//   const addedGameIndex = req.games.findIndex((game) => game.slug === slug);

//   if (addedGameIndex > -1) {
//     res.send("game already added");
//     return;
//   }

//   const newGame = {
//     name,
//     rating,
//     playtime,
//     slug,
//   };

//   req.games.push(newGame);
//   console.log("New game added:", newGame);

//   res.sendStatus(200);
// }

// // deleting
// function deleteGame(req, res) {
//   console.log("game deleted route ran");

//   const gameSlug = req.params.slug;

//   const gameToDelete = req.games.findIndex((game) => game.slug === gameSlug);
//   console.log("the index is", gameToDelete);
//   console.log("the game is", gameSlug);

//   if (gameToDelete === -1) {
//     res.status(404).send("Game not found");
//     return;
//   }

//   req.games.splice(gameToDelete, 1);

//   res.status(200).send("Game deleted successfully");
// }

// // updating
// function updateGame(req, res) {
//   console.log("update game route ran");

//   const gameSlug = req.params.slug;
//   console.log(gameSlug);

//   if (!gameSlug) {
//     res.send("couldn't find that game");
//     return;
//   }

//   const gameToUpdate = req.games.findIndex((game) => {
//     return game.slug === gameSlug;
//   });

//   console.log(gameToUpdate);
//   const { slug, name, rating, playtime } = req.body;

//   if (gameToUpdate === -1) {
//     res.send("not found");
//   }
//   if (name) {
//     req.games[gameToUpdate].name = name;
//   }

//   if (rating) {
//     req.games[gameToUpdate].rating = rating;
//   }
//   if (playtime) {
//     req.games[gameToUpdate].playtime = playtime;
//   }
//   const updatedGame = req.games[gameToUpdate];

//   res.status(200).send(updatedGame);
// }

// module.exports = {
//   getGamesList,
//   getGame,
//   addGame,
//   deleteGame,
//   updateGame,
// };
