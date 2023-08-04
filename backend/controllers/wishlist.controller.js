const asyncMySQL = require("../database/connection");

// gets all wishlists

async function getWishlists(req, res) {
  const results = await asyncMySQL(`SELECT *
                                        FROM wishlists
                                            ;`);

  if (results.length > 0) {
    res.send({ status: 200, results });
    return;
  }

  res.send({ status: 404, reason: "No wishlists found" });
}

// // gets individual wishlist
async function getWishlist(req, res) {
  console.log("getting individual game route ran");
  const id = req.params.id;

  const results = await asyncMySQL(`SELECT id, name
                                        FROM wishlists
                                            WHERE id LIKE '${id}';`);

  if (results.length > 0) {
    res.send({ status: 200, results });
    return;
  }

  res.send({ status: 404, reason: "wishlist not found with that id" });
}

// // adds a wishlist
async function createWishlist(req, res) {
  // note the functionality is that the user creates a wishlist first, and then adds games to it.
  console.log("add wishlist route ran");
  // TODO: could use slug instead of id?
  const { name, customer_id, game_id } = req.body;

  if (
    typeof name !== "string" ||
    typeof customer_id !== "number" ||
    typeof game_id !== "number"
  ) {
    res.send("can't save that wishlist");
    return;
  }

  //   if (
  //     !name ||
  //     typeof name !== "string" ||
  //     customer_id ||
  //     typeof customer_id !== "number" ||
  //     !game_id ||
  //     typeof game_id !== "number"
  //   ) {
  //     res.send("can't save that wishlist");
  //     return;
  //   }

  //   TODO: once users properly set up will be inserting (name, customer_id)
  try {
    const wishlist = await asyncMySQL(`INSERT INTO wishlists
                                            (name, customer_id, game_id)
                                                VALUES
                                                    ('${name}', '${customer_id}','${game_id}' )`);

    // receiving newly created wishlist id to use with wishlist_games table
    const wishlist_id = wishlist.insertId;

    // selecting games from
    const game = await asyncMySQL(`SELECT id FROM games
                                        WHERE id Like (${game_id});`);

    const user_id = customer_id;

    //  inserting wishlist and game id into wishlist_games table.
    const gameId = game[0].id;
    if (game_id) {
      await asyncMySQL(`INSERT INTO wishlist_games
        (wishlist_id, game_id, user_id)
        VALUES
        ('${wishlist_id}', '${gameId}', '${user_id}')`);
      res.sendStatus(200);
    }
  } catch (error) {
    console.log("error:", error);
    res.send({ status: 500, reason: "Internal server error" });
  }
}

// // // deleting
async function deleteWishlist(req, res) {
  console.log("wishlist deleted route ran");

  const id = req.params.id;

  //   if (id !== "number") {
  //     res.send("no wishlist found");
  //     return;
  //   }

  try {
    await asyncMySQL(`DELETE
                          FROM wishlists
                              WHERE id LIKE '${id}';`);

    res.sendStatus(200);
  } catch (error) {
    console.log("error:", error);
    res.sendStatus(500);
    return;
  }
}

// // // // updating
// // TODO: finish

// TODO: finish

async function updateWishlist(req, res) {
  console.log("update game route ran");

  const { id, name } = req.body;

  //   if (
  //     !name ||
  //     typeof name !== "string" ||
  //     !wishlist_id ||
  //     typeof wishlist_id !== "number"
  //   ) {
  //     res.send("can't save that wishlist");
  //     return;
  //   }

  try {
    // const wishlistToUpdate = await asyncMySQL(`SELECT id FROM wishlists
    //                                             WHERE id LIKE '${id}';`);
    console.log("the id is:", id);
    console.log(wishlistToUpdate);
    if (name && typeof name === "string") {
      await asyncMySQL(`UPDATE wishlists SET name = "${name}"
                            WHERE
                                id = "${id}";`);
      res.sendStatus(200);
    }
  } catch (error) {
    console.log("error:", error);
    res.send({ status: 400, reason: error.sqlMessage });
  }
  //   res.sendStatus(200);
}

async function addGamesToWishlist(req, res) {
  const { wishlist_id, game_id, user_id } = req.body;

  if (typeof game_id !== "number") {
    res.send("can't save that game to the wishlist");
    return;
  }

  //   const wishListToAddTo = await asyncMySQL(`SELECT id FROM wishlist_games
  //                                             WHERE id LIKE '${id}'`);

  try {
    await asyncMySQL(`INSERT INTO wishlist_games
                            (wishlist_id, game_id, user_id)
                                VALUES
                                    (${wishlist_id},${game_id}, ${user_id});`);
    res.sendStatus(200);
  } catch (error) {
    res.send({ status: 404, reason: "There was a problem adding that game" });
    console.log("There was an error:", error);
  }
}
module.exports = {
  getWishlist,
  getWishlists,
  createWishlist,
  deleteWishlist,
  updateWishlist,
  addGamesToWishlist,
};
