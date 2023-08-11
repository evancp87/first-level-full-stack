// import { getCachedGames, cacheGames } from "./helpers";

import axios from "axios";
export const getGames = async () => {
  try {
    const { data } = await axios.get("http://localhost:6001/games/");
    return data;
  } catch (error) {
    console.log("There was an error", error);
  }
};

console.log(getGames());

export const gamesByDate = async (startDate, endDate) => {
  console.log("the dates are:", startDate, endDate);
  try {
    // Will take a start date and end date at point of dispatch to the store
    const { data } = await axios.get(
      // `http://localhost:6001/games/dates}`
      // `https://api.rawg.io/api/games?dates=${startDate},${endDate}&key=${apiKey}`
      // `https://api.rawg.io/api/games?dates=${startDate},${endDate}&key=${apiKey}`
      `http://localhost:6001/games/dates?startDate=${startDate}&endDate=${endDate}`
    );

    console.log("the data os", data);
    // gets games within date range that have rating of over 3.5. I found 4 and 4.5 too narrow
    const filteredResults = data.results.filter((game) => {
      return game.rating >= 3.5;
    });
    const results = filteredResults.slice(0, 10);
    return results;
    // return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// genres
export const getGenres = async () => {
  try {
    const { data } = await axios.get(`http://localhost:6001/games/genres`);
    // return data.results;
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// platform names
export const getPlatforms = async () => {
  try {
    const { data } = await axios.get(`http://localhost:6001/games/platforms`);
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};
// screenshots
export const getScreenshots = async (game_pk) => {
  try {
    const { data } = await axios.get(
      `http://localhost:6001/games/screenshots/${game_pk}`
    );
    console.log("the data is:", data);
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// Get details of a single game.

export const getGameDetail = async (slug) => {
  try {
    const { data } = await axios.get(`http://localhost:6001/games/${slug}`);
    // `https://api.rawg.io/api/games/${slug}?key=${api}`

    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// Get a list of game trailers. Nb only found one game so far with a trailer - GTA V

export const getGameTrailers = async (slug) => {
  try {
    const { data } = await axios.get(
      `http://localhost:6001/games/trailers/${slug}`
    );

    console.log();
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// cart api calls

export const getCartItems = async () => {
  try {
    const { data } = await axios.get(`http://localhost:6001/cart/`);
    return data.results;
  } catch (error) {
    console.log("error:", error);
  }
};

export const addToCart = async () => {
  try {
    const { data } = await axios.post(`http://localhost:6001/cart/`);
    return data.results;
  } catch (error) {
    console.log("error:", error);
  }
};

export const clearCart = async (cartId) => {
  try {
    const { data } = await axios.delete(`http://localhost:6001/cart/${cartId}`);
    return data.results;
  } catch (error) {
    console.log("error:", error);
  }
};

export const removeFromCart = async (cartId, gameId) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:6001/cart/${gameId}/${cartId}`
    );
    return data.results;
  } catch (error) {
    console.log("error:", error);
  }
};

export const incrementItemQuantity = async (gameId) => {
  try {
    const { data } = await axios.patch(`http://localhost:6001/cart/${gameId}`);
    return data.results;
  } catch (error) {
    console.log("error:", error);
  }
};

// login api calls

export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(
      "http://localhost:6001/users/login",
      credentials
    );
    console.log("the data is:", data);
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};
export const register = async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:6001/users/register/",
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const logout = async () => {
  try {
    await axios.post("http://localhost:6001/users/logout/");
  } catch (error) {
    console.log("There was an error logging out", error);
  }
};

// wishlist api calls
// TODO: remove game from wishlist
export const wishlists = async (customerId, token) => {
  try {
    const data = await axios.get(
      // `http://localhost:6001/wishlists?customerId=${userId}`
      `http://localhost:6001/wishlists?customerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("the data for the wishlists is:", data);
    console.log(data);
    return data.data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};
export const singleWishlist = async (singleWishlistData) => {
  const { token, id, userId } = singleWishlistData;
  console.log(token, id, userId);
  try {
    const { data } = await axios.get(
      ` http://localhost:6001/wishlists/${id}?userId=${userId}`,
      // {
      //   id,
      //   userId,
      // },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.results[0];
  } catch (error) {
    console.log("There was an error:", error);
  }
};
export const createWishlist = async (
  // customerId,
  // token,
  // wishlistName,
  // gameSlug
  credentials
) => {
  console.log("the credentials id are:", credentials);
  try {
    // const wishlist = {
    //   name: name,
    //   customerId: customerId,
    //   game: game
    // }
    console.log(credentials);
    const data = await axios.post(
      `http://localhost:6001/wishlists/?customerId=${credentials.userId}`,
      {
        name: credentials.wishlistWithGame.name,
        slug: credentials.wishlistWithGame.slug,
      },
      {
        headers: {
          Authorization: `Bearer ${credentials.token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};
export const deleteWishlist = async (wishlist) => {
  const { id, token, userId } = wishlist;
  try {
    const data = await axios.delete(
      `http://localhost:6001/wishlists/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};
export const updateWishlist = async () => {
  try {
    const { data } = await axios.patch("http://localhost:6001/games/wishlist");
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};
export const addGamesOnWishlist = async (
  // userId,
  // wishlistId,
  // gameSlug,
  // token

  gameToAdd
) => {
  console.log(gameToAdd);
  try {
    const { data } = await axios.post(
      `http://localhost:6001/wishlists/add?userId=${gameToAdd.userId}&wishlistId=${gameToAdd.wishlistId}`,

      {
        slug: gameToAdd.slug,
      },
      {
        headers: {
          Authorization: `Bearer ${gameToAdd.token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};

export const listOfGamesWishlist = async (
  // userId,
  // wishlistId,
  // gameSlug,
  // token

  gamesList
) => {
  console.log(gamesList);
  const { userId, token, id } = gamesList;
  try {
    const { data } = await axios.get(
      `http://localhost:6001/games/wishlist?userId=${userId}&wishlistId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};
