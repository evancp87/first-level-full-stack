const asyncMySQL = require("../database/connection");

// gets all wishlists

async function getWishlists(req, res) {
  const customerId = req.query.customerId;

  if (!customerId || isNaN(customerId)) {
    res.status(400).send("please use a valid customer id");
    return;
  }
  const results = await asyncMySQL(`SELECT *
                                        FROM wishlists
                                            WHERE customer_id = ${customerId};`);

  if (results.length > 0) {
    res.status(200).send(results);
    return;
  }

  res.send({ status: 404, reason: "No wishlists found" });
}

// // gets individual wishlist
async function getWishlist(req, res) {
  console.log("getting individual game route ran");
  const id = req.params.id;
  const customerId = req.query.customerId;

  if (!id || isNaN(id) || !customerId || isNaN(customerId)) {
    res.status(400).send("please add a correct id");
  }

  // TODO add user id
  const results = await asyncMySQL(`SELECT name
                                        FROM wishlists
                                            WHERE id = ${id} AND customer_id = ${customerId};`);

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
  const { name, slug } = req.body;
  const customerId = req.query.customerId;

  if (
    !name ||
    typeof name !== "string" ||
    !customerId ||
    isNaN(customerId) ||
    !slug ||
    typeof slug !== "string"
  ) {
    res.status(400).send("can't save that wishlist");
    return;
  }

  try {
    const gameId = await asyncMySQL(`SELECT id FROM games
                                        WHERE slug = '${slug}';`);

    const game = gameId[0].id;

    const wishlist = await asyncMySQL(`INSERT INTO wishlists
                                            (name, customer_id, game_id)
                                                VALUES
                                                    ('${name}', '${customerId}','${game}' )`);

    // receiving newly created wishlist id to use with wishlist_games table
    const wishlist_id = wishlist.insertId;

    const user_id = customerId;

    //  inserting wishlist and game id into wishlist_games table.

    if (gameId) {
      await asyncMySQL(`INSERT INTO wishlist_games
        (wishlist_id, game_id, user_id)
        VALUES
        ('${wishlist_id}', '${game}', '${user_id}')`);
      res.status(200).send("wishlist created and game added");
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
  const userId = req.query.userId;

  if (!id || isNaN(id) || !userId || isNaN(userId)) {
    res.status(404).send("no wishlist found");
    return;
  }
  const userResult = await asyncMySQL(`SELECT user_id FROM users
                                  WHERE user_id = ${userId}`);

  const user = userResult[0].user_id;
  console.log(user);
  try {
    await asyncMySQL(`DELETE FROM wishlist_games 
    WHERE wishlist_id = '${id}'`);

    await asyncMySQL(`DELETE
                          FROM wishlists
                              WHERE id = '${id}' AND customer_id = ${user};`);

    res.status(200).send("wishlist deleted");
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("internal server error");
    return;
  }
}

// // // // updating
// // TODO: finish

// TODO: finish

async function updateWishlist(req, res) {
  console.log("update game route ran");
  // TODO: add user
  const { name } = req.body;
  const wishlistId = req.params.id;
  const userId = req.params.userId;
  if (
    !name ||
    typeof name !== "string" ||
    !wishlistId ||
    isNaN(wishlistId) ||
    !userId ||
    isNaN(userId)
  ) {
    res.status(404).send("can't save that wishlist");
    return;
  }

  try {
    if (name && typeof name === "string") {
      await asyncMySQL(`UPDATE wishlists SET name = "${name}"
                            WHERE
                                id = ${wishlistId} AND customer_id = ${userId};`);
      res.sendStatus(200);
    }
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("internal server error");
  }
  //   res.sendStatus(200);
}

async function addGamesToWishlist(req, res) {
  console.log("adding game to wishlist ran");
  const { slug } = req.body;
  const wishlistId = req.query.wishlistId;
  const userId = req.query.userId;

  if (
    !slug ||
    typeof slug !== "string" ||
    !wishlistId ||
    isNaN(wishlistId || !userId) ||
    isNaN(userId)
  ) {
    res.status(404).send("can't save that game to the wishlist");
    return;
  }

  try {
    const wishlist = await asyncMySQL(`SELECT id FROM wishlists 
                                          WHERE id = ${wishlistId} AND customer_id = ${userId}`);

    if (wishlist.length === 0) {
      res.status(404).send("Wishlist not found for the specified user");
      return;
    }
    const game = await asyncMySQL(
      `SELECT id from games WHERE slug = '${slug}'`
    );

    const gameToAdd = game[0].id;

    await asyncMySQL(`INSERT INTO wishlist_games
                            (wishlist_id, game_id, user_id)
                                VALUES
                                    (${wishlistId},${gameToAdd}, ${userId});`);
    res.status(200).send("game added to wishlist");
  } catch (error) {
    res.status(500).send("There was a problem adding that game");
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
