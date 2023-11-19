const asyncMySQL = require("../database/connection");
const {
  cartItems,
  selectTotal,
  selectCartId,
  selectGameId,
  selectTotalByCartAndCustomer,
  selectExistingGame,
  setTotal,
  setQuantity,
  getGameDetails,
  addGame,
  newCartQuery,
  insertGames,
  deleteAllGamesFromCart,
  clearCarts,
  getAllGamesFromCart,
  deleteSingleGame,
  deleteCart,
} = require("../database/queries");

// gets cart list

async function getCartItems(req, res) {
  const { customerId } = req.query;

  // sanitisation
  if (!customerId || isNaN(customerId)) {
    res.status(404).send("Couldn't find that customer");
    return;
  }

  try {
    // get's current total for cart if items present
    const total = await asyncMySQL(selectTotal(), [customerId]);
    const finalTotal = total[0];
    // gets cart items from db
    const results = await asyncMySQL(cartItems(), [customerId]);
    if (results.length > 0) {
      res.status(200).send({ results, finalTotal });
    } else {
      res.status(200).send({ message: "No cart items found", results: [] });
    }
  } catch (error) {
    console.error("There was an error", error);
    res.status(500).send("Couldn't get the cart");
  }
}

// handles adding to cart
async function addToCart(req, res) {
  const { customerId, gameId, price } = req.query;
  // sanitisation
  if (
    !customerId ||
    isNaN(customerId) ||
    !gameId ||
    isNaN(gameId) ||
    !price ||
    isNaN(price)
  ) {
    res.status(404).send("Game was not added to the cart successfully");
    return;
  }

  // finds existing instance of a cart
  try {
    //  checks for existing cart
    const existingCart = await asyncMySQL(selectCartId(), [customerId]);
    const gameExists = await asyncMySQL(selectGameId(), [gameId]);

    // If the game doesn't exist, respond with an error
    if (gameExists.length === 0) {
      res.status(404).send("This game is not yet available for purchase");
      return;
    }

    // adds to cart if existing cart
    if (existingCart.length > 0) {
      const checkCart = existingCart[0]?.id;

      // gets total for updating with new game
      let newTotal = await asyncMySQL(selectTotalByCartAndCustomer(), [
        checkCart,
        customerId,
      ]);

      let anotherTotal = newTotal[0]?.total;

      const cartId = existingCart[0].id;

      // checks if game is in basket already and increments item if added to basket and already exists
      const existingItem = await asyncMySQL(selectExistingGame(), [
        gameId,
        cartId,
      ]);
      if (existingItem && existingItem.length > 0) {
        const total = anotherTotal + Number(price);

        // updates total
        await asyncMySQL(setTotal(), [total, cartId, customerId]);
        const newQuantity = (existingItem[0].quantity += 1);

        const gameDetails = await asyncMySQL(getGameDetails(), [gameId]);

        await asyncMySQL(setQuantity(), [newQuantity, gameId, cartId]);
        res
          .status(200)
          .send({ message: "item quantity incremented", gameDetails, total });
      } else {
        // if game isn't in cart, adds to cart

        const newGame = await asyncMySQL(addGame(), [gameId, cartId]);
        // calculates new total
        const total = anotherTotal + Number(price);

        await asyncMySQL(setTotal(), [total, cartId, customerId]);

        const gameDetails = await asyncMySQL(getGameDetails(), [gameId]);

        res.status(200).send({ message: "success!", gameDetails, total });
      }
    } else {
      // creates new cart and inserts game into cart if cart is empty/doesn't exist
      const newCart = await asyncMySQL(newCartQuery(), [customerId]);

      //  gets newly inserted cart id
      const cartId = newCart.insertId;

      // inserts games into that cart

      await asyncMySQL(insertGames(), [gameId, cartId]);

      // calculates total and sets
      let newTotal = await asyncMySQL(selectTotalByCartAndCustomer(), [
        cartId,
        customerId,
      ]);

      let anotherTotal = newTotal[0]?.total;

      const total = anotherTotal + Number(price);

      await asyncMySQL(setTotal(), [total, cartId, customerId]);

      const gameDetails = await asyncMySQL(getGameDetails(), [gameId]);

      res.status(200).send({ message: "success!", gameDetails, total });
    }
  } catch (error) {
    console.log("There was an error:", error);
    res.status(500).send("There was a problem adding that game to the cart");
  }
}

/// clears cart
async function clearCart(req, res) {
  const customerId = req.query.customerId;

  // sanitisation
  if (!customerId || isNaN(customerId)) {
    res.status(400).send("Game was not added to the cart successfully");
    return;
  }
  // get cart under user

  const cart = await asyncMySQL(selectCartId(), [customerId]);

  const cartId = cart[0].id;

  // deletes games from cart and then cart
  try {
    await asyncMySQL(deleteAllGamesFromCart(), [cartId]);

    await asyncMySQL(clearCarts(), [customerId]);

    res.status(200).send("cart cleared successfully");
  } catch (error) {
    console.log("error:", error);
    res.status(500).send("Internal server error. Couldn't clear the cart");
  }
}

// deleting
async function removeFromCart(req, res) {
  const { gameId, customerId, price, cartId, quantity } = req.query;

  //  sanitisation
  if (
    !customerId ||
    isNaN(
      customerId ||
        !gameId ||
        isNaN(gameId) ||
        !price ||
        isNaN(price) ||
        !cartId ||
        isNaN(cartId)
    )
  ) {
    res.status(404).send("Game was not added to the cart successfully");
    return;
  }
  // get cart under user
  const cart = await asyncMySQL(selectCartId(), [customerId]);
  const cartGames = await asyncMySQL(getAllGamesFromCart(), [cartId]);

  // deletes game from cart

  await asyncMySQL(deleteSingleGame(), [gameId, Number(cartId)]);

  // calculates total and sets
  let newTotal = await asyncMySQL(selectTotalByCartAndCustomer(), [
    cartId,
    customerId,
  ]);

  let anotherTotal = newTotal[0]?.total;
  let total = Number(anotherTotal) - Number(price);

  await asyncMySQL(setTotal(), [total, cartId, customerId]);

  // if cart is empty of games, delete cart
  if (cartGames.length === 1) {
    await asyncMySQL(deleteCart(), [cartId]);
  }

  // if more than one of a game, delete by quantity x price
  if (quantity > 1) {
    let deduction = quantity * Number(price);
    total = Number(anotherTotal) - Number(deduction);
    await asyncMySQL(setTotal(), [total, cartId, customerId]);
  }

  res
    .status(200)
    .send({ message: "successfully deleted game from cart", total });
}

module.exports = {
  getCartItems,
  addToCart,
  clearCart,
  removeFromCart,
};
