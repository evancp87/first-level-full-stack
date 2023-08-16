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
};
