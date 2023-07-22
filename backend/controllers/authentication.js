// function getWishLists(req, res) {
//     console.log("route ran");
//     res.send(req.wishlists);
//   }

export const createUser = (req, res) => {
  const { username, firstName, lastName, password, email, address } = req.body;

  const _users = [...req.users];

  const usernameIndex = _users.find((user) => user.username === username);

  // Check for existing wishlist
  if (usernameIndex > -1) {
    res.send("There is already a user with this username");
    return;
  }

  const newUser = {
    username,
    firstName,
    lastName,
    password,
    email,
    address,
  };

  req.users.push(newUser);

  res.sendStatus(200);
};

// const getWishlist = (req, res) => {
//   const id = req.params.id;

//   if (Number.isNaN(id) || typeof id !== "number") {
//     return res.send(404);
//   }
//   const _wishlists = [...req.wishlists];

//   const wishlist = _wishlists.find((list) => list.id === id);

//   if (!list) {
//     return res.send(404);
//   }
//   res.send(wishlist);
// };

export const deleteUser = (req, res) => {
  const { username, firstName, lastName, password, email, address } = req.body;

  const _users = [...req.users];

  const userToDelete = _users.findIndex((user) => user.username === username);

  if (indexOf === -1) {
    res.send(
      "A user with that username couldn't be found, perhaps it was already deleted."
    );
    res.sendStatus(404);
  }

  _users.splice(userToDelete, 1);
  req.users = _users;

  res.send("user deleted successfully");
};

export const updateUser = (req, res) => {
  const { username, firstName, lastName, password, email, address } = req.body;

  const _users = [...req.users];
  if (username === -1) {
    res.sendStatus(404).send("We couldn't find a user with that username");
  }

  const userToUpdate = _users.findIndex((user) => user.username === username);

  if (username) {
    req.wishlists[userToUpdate].username = username;
  }

  if (firstName) {
    req.wishlists[userToUpdate].firstName = firstName;
  }

  if (lastName) {
    req.wishlists[userToUpdate].lastName = lastName;
  }

  if (password) {
    req.wishlists[userToUpdate].password = password;
  }

  if (email) {
    req.wishlists[userToUpdate].email = email;
  }

  if (address) {
    req.wishlists[userToUpdate].address = address;
  }

  firstName, lastName, password, email, address;

  res.sendStatus(200);
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
};

// // gets game list

// const getGamesList(req, res) {
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
