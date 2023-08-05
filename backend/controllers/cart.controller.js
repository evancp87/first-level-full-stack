const asyncMySQL = require("../database/connection");

// gets cart list

async function getCartItems(req, res) {
  console.log("cart route ran");

  const customerId = req.query.customerId;

  if (!customerId || isNaN(customerId)) {
    res.status(404).send("Couldn't find that customer");
    return;
  }

  //  Selects game in cart using customer id
  const results = await asyncMySQL(`
  SELECT games.name
  FROM games
  INNER JOIN cart_games ON cart_games.game_id = games.id
    WHERE cart_games.cart_id IN (
    SELECT id FROM cart WHERE user_id = ${customerId}
  );
`);

  if (results.length > 0) {
    res.status(200).send(results);
    return;
  }

  res.status(404).send("No cart items found");
}

// handles adding to cart
async function addToCart(req, res) {
  console.log("add to cart route ran");

  const customerId = req.query.customerId;
  const gameId = req.query.gameId;
  const total = req.query.total;

  if (
    !customerId ||
    isNaN(customerId) ||
    !gameId ||
    isNaN(gameId) ||
    !total ||
    isNaN(total)
  ) {
    res.status(404).send("Game was not added to the cart successfully");
    return;
  }

  try {
    const existingCart = await asyncMySQL(
      `SELECT id FROM cart WHERE user_id = ${customerId};`
    );

    if (existingCart.length > 0) {
      const cartId = existingCart[0].id;
      console.log(cartId);

      await asyncMySQL(`INSERT INTO cart_games (game_id, cart_id)
        VALUES
        ('${gameId}', '${cartId}');`);
      res.status(200).send("success!");
    } else {
      const newCart = await asyncMySQL(`INSERT INTO cart( user_id, total) 
                                             VALUES (${customerId}, ${total});`);

      const cartId = newCart.insertId;

      await asyncMySQL(`INSERT INTO cart_games (game_id, cart_id)
                            VALUES
                               ('${gameId}', '${cartId}');`);

      res.status(200).send("success!");
    }
  } catch (error) {
    console.log("There was an error:", error);
    res.status(500).send("internal server error");
  }
}

// // adds a game

async function clearCart(req, res) {
  console.log("clear cart route ran");
  const customerId = req.query.customerId;

  if (!customerId || isNaN(customerId)) {
    res.status(400).send("Game was not added to the cart successfully");
    return;
  }
  // get cart under user
  const cart = await asyncMySQL(
    `SELECT id FROM cart WHERE user_id = ${customerId};`
  );

  const cartId = cart[0].id;
  console.log(cartId);
  // TODO: does  cart need to be deleted?
  try {
    await asyncMySQL(`DELETE FROM cart_games 
                        WHERE cart_id = '${cartId}'`);

    await asyncMySQL(`DELETE FROM cart
                        WHERE user_id = ${customerId}`);
    res.status(200).send("Game deleted successfully");
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Internal server error. Couldn't clear the cart");
  }
}

// // deleting
async function removeFromCart(req, res) {
  console.log("game deleted route ran");

  const gameId = req.query.gameId;
  const customerId = req.query.customerId;

  console.log(customerId);
  if (!customerId || isNaN(customerId || !gameId || isNaN(gameId))) {
    res.status(404).send("Game was not added to the cart successfully");
    return;
  }
  // get cart under user
  const cart = await asyncMySQL(
    `SELECT id FROM cart WHERE user_id = ${customerId};`
  );

  console.log(cart);

  const cartId = cart[0].id;

  console.log(cartId);

  await asyncMySQL(`DELETE FROM cart_games 
                                  WHERE game_id = ${gameId} AND cart_id = ${cartId};`);

  res.status(200).send("successfully deleted game from cart");
}

// TODO: look into this as really a cart should only be created when a game is added
async function createCart(req, res) {
  //   await asyncMySQL(`CREATE)
  return;
}

// // // updati
// TODO: finish off
async function incrementItemQuantity(req, res) {
  console.log("update game route ran");

  const { price } = req.body;
  if (!price && typeof Number(price) != "number") {
    res.send("couldn't update the price");
  }
  try {
    await asyncMySQL(`UPDATE games SET slug = "${gameSlug}"
                        WHERE
                          slug LIKE "${slug}";`);
  } catch (error) {
    console.log("error:", error);
    res.send({ status: 400, reason: error.sqlMessage });
  }
  res.sendStatus(200);
}

async function calculateTotal(req, res) {}

module.exports = {
  getCartItems,
  addToCart,
  clearCart,
  removeFromCart,
  incrementItemQuantity,
  createCart,
};
