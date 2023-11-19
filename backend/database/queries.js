module.exports = {
  getUserId: () => {
    return `SELECT user_id FROM users
                        WHERE email = ?;`;
  },
  registerUserId: () => {
    return `SELECT user_id, name, email FROM users
                        WHERE email = ?;`;
  },
  checkUser: () => {
    return `SELECT password, user_id, name, email
                    FROM users
                    WHERE email = ?;`;
  },
  addUser: () => {
    return `INSERT INTO users 
                (name, email, password)
                    VALUES
                        (?,?,?);`;
  },
  getWishlistName: () => {
    return `SELECT name
                FROM wishlists
                    WHERE id = ? AND customer_id = ?;`;
  },
  getGameId: () => {
    return `SELECT id FROM games
                WHERE slug = ?;`;
  },
  insertIntoWishlist: () => {
    return `INSERT INTO wishlists
                (name, customer_id)
                    VALUES
                        (?,?);`;
  },
  insertIntoWishlistGames: () => {
    return `INSERT INTO wishlist_games
                (wishlist_id, game_id, user_id)
                    VALUES
                        (?,?,?);`;
  },
  selectUserById: () => {
    return `SELECT user_id FROM users
                WHERE user_id = ?;`;
  },
  deleteFromWishlist: () => {
    return `DELETE FROM wishlists
                WHERE id = ? AND customer_id = ?;`;
  },
  deleteFromWishlistGames: () => {
    return `DELETE FROM wishlist_games 
                            WHERE wishlist_id = ?;`;
  },
  getWishlistId: () => {
    return `SELECT id FROM wishlists 
      WHERE id = ? AND customer_id = ?;`;
  },
  getGameIdWishlist: () => {
    return `SELECT id FROM games WHERE slug = ? ;`;
  },
  deleteSingleGameFromWishlist: () => {
    return `DELETE FROM wishlist_games
                    WHERE
                        game_id = ? AND user_id = ? AND wishlist_id = ?;`;
  },
  newlyCreatedGame: () => {
    return `
  SELECT
    games.released,
    games.Name AS name,
    games.background_image,
    games.slug,
    games.id,
    games.rating,
    users.name AS user_name,
    wishlist_games.wishlist_id as wishlist_id
  FROM games
  JOIN wishlist_games ON wishlist_games.game_id = games.id
  JOIN users ON users.user_id = wishlist_games.user_id
  WHERE wishlist_games.user_id = ? AND wishlist_games.wishlist_id = ? AND games.id = ?;
`;
  },
  gamePrice: () => {
    return `SELECT games.price
                      FROM games
                        INNER JOIN cart_games ON games.id = cart_games.game_id
                          WHERE cart_games.game_id = ?;`;
  },
  updateTotalQuery: () => {
    return `UPDATE cart SET total = ? WHERE id = ? AND user_id = ?;`;
  },
  existingTotal: () => {
    return `   SELECT total FROM cart WHERE id = ? AND user_id = ?`;
  },
  cartItems: () => {
    return `
    SELECT
    games.name AS gameName,
    games.price as gamePrice,
    games.background_image, 
    games.id AS gameId,
    cart_games.quantity,
    cart.total,
    cart.id AS cartId
  
  FROM games
  INNER JOIN cart_games ON cart_games.game_id = games.id
  INNER JOIN cart ON cart.id = cart_games.cart_id
  WHERE cart_games.cart_id IN (SELECT id FROM cart WHERE user_id = ?);
    `;
  },
  selectTotal: () => {
    return `select total FROM cart WHERE user_id = ?`;
  },
  selectCartId: () => {
    return `SELECT id FROM cart WHERE user_id = ?;`;
  },
  selectGameId: () => {
    return `SELECT id FROM games WHERE id = ?;`;
  },
  selectTotalByCartAndCustomer: () => {
    return `SELECT total FROM cart WHERE id = ? AND user_id = ? `;
  },
  selectExistingGame: () => {
    return `SELECT quantity from cart_games WHERE game_id = ? AND cart_id = ?;`;
  },
  setTotal: () => {
    return `UPDATE cart SET total = ? WHERE id = ? AND user_id = ?;`;
  },
  setQuantity: () => {
    return `UPDATE cart_games SET quantity = ? WHERE game_id = ? AND cart_id = ?`;
  },
  getGameDetails: () => {
    return `SELECT games.name AS gameName, games.price AS gamePrice, games.background_image, games.id AS gameId, cart_games.cart_id AS cartId FROM games LEFT JOIN cart_games ON games.id = cart_games.game_id WHERE games.id = ?`;
  },
  addGame: () => {
    return `INSERT INTO cart_games (game_id, cart_id)
                            VALUES (? , ?);`;
  },
  newCartQuery: () => {
    return `INSERT INTO cart( user_id) 
              VALUES (?);`;
  },
  insertGames: () => {
    return `INSERT INTO cart_games (game_id, cart_id)
    VALUES (?, ?);`;
  },
  deleteAllGamesFromCart: () => {
    return `DELETE FROM cart_games 
          WHERE cart_id = ?`;
  },
  clearCarts: () => {
    return `DELETE FROM cart
              WHERE user_id = ?`;
  },
  getAllGamesFromCart: () => {
    return `SELECT * FROM cart_games WHERE cart_id = ?`;
  },
  deleteSingleGame: () => {
    return `DELETE FROM cart_games 
    WHERE game_id = ? AND cart_id = ?;`;
  },
  deleteCart: () => {
    return `DELETE FROM cart where id = ?`;
  },
};
