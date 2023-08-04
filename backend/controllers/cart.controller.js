const asyncMySQL = require("../database/connection");

// gets cart list

async function getCartItems(req, res) {
  console.log("cart route ran");
  const results = await asyncMySQL(`SELECT *
                                        FROM cart_games;`);

  if (results.length > 0) {
    res.send({ status: 200, results });
    return;
  }

  res.send({ status: 404, reason: "No cart items found" });
}

// handles adding to cart
async function addToCart(req, res) {
  console.log("add to cart route ran");
  //   const { name, background_image, id, price, slug } = req.body;
  const { game_id, cart_id } = req.body;

  if (req.session.user_id) {
  }

  await asyncMySQL(`INSERT INTO cart_games (game_id, cart_id)
                                         VALUES
                                         ('${game_id}', '${cart_id}');`);
  if (
    !game_id ||
    typeof game_id !== "number" ||
    !cart_id ||
    typeof cart_id !== "number"
  ) {
    res.send("Game was not added to the cart successfully");
  }
  res.send({ status: 200, reason: "success!" });
}

// // adds a game

async function clearCart(req, res) {
  console.log("clear cart route ran");
  const cartId = req.params.cartId;

  if (!cartId && typeof Number(cartId) !== "number") {
    res.send("couldn't clear the cart");
    return;
  }

  try {
    await asyncMySQL(`DELETE FROM cart_games 
                      WHERE cart_id = '${cartId}'`);
    res.sendStatus(200);
  } catch (error) {
    console.log("error:", error);
    res.send({ status: 500, reason: "couldn't clear the cart" });
  }
}

// // deleting
async function removeFromCart(req, res) {
  console.log("game deleted route ran");

  const gameId = req.params.gameId;
  const cartId = req.params.cartId;
  // if (!gameId || typeof !gameId !== "number" || !cartId || typeof cartId !== "number") {
  //   res.send("unable to delete that game");
  //   return;
  // }

  await asyncMySQL(`DELETE FROM cart_games 
                                  WHERE game_id = ${gameId} AND cart_id = ${cartId};`);

  res.sendStatus(200);
}

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
