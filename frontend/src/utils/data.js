import { getCachedGames, cacheGames } from "./helpers";
import axios from "axios";

const endpoint = import.meta.env.VITE_BASE_URL;
// imports games from db
export const getGames = async () => {
  try {
    const { data } = await axios.get(`${endpoint}/games/`);
    return data;
  } catch (error) {
    console.log("There was an error", error);
  }
};

// top ten list of games in db
export const getTopRated = async () => {
  try {
    // fetches games from cache if present
    const cachedGames = getCachedGames();

    if (
      cachedGames !== null &&
      cachedGames !== undefined &&
      cachedGames.length > 0
    ) {
      console.log("Fetching games from cache...");
      return cachedGames;
    } else {
      const { data } = await axios.get(`${endpoint}/games/highest`);
      // caches data if not present
      cacheGames(data);
      return data;
    }
  } catch (error) {
    console.log("There was an error", error);
  }
};

export const gamesByDate = async (startDate, endDate) => {
  try {
    // Will take a start date and end date at point of dispatch to the store
    const { data } = await axios.get(
      `${endpoint}/games/dates?startDate=${startDate}&endDate=${endDate}`
    );

    // gets games within date range that have rating of over 3.5. I found 4 and 4.5 too narrow
    // filters so the most popular new games are shown
    const filteredResults = data.results.filter((game) => {
      return game.rating >= 3.5;
    });
    const results = filteredResults.slice(0, 10);
    return results;
  } catch (error) {
    console.log("error:", error);
  }
};

// genres
export const getGenres = async () => {
  try {
    const { data } = await axios.get(`${endpoint}/games/genres`);
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// platform names
export const getPlatforms = async () => {
  try {
    const { data } = await axios.get(`${endpoint}/games/platforms`);
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// screenshots
export const getScreenshots = async (game_pk) => {
  try {
    const { data } = await axios.get(
      `${endpoint}/games/screenshots/${game_pk}`
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
    const { data } = await axios.get(`${endpoint}/games/${slug}`);

    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// Get a list of game trailers. Nb only found one game so far with a trailer - GTA V

export const getGameTrailers = async (slug) => {
  try {
    const { data } = await axios.get(`${endpoint}/games/trailers/${slug}`);

    console.log();
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// NB cart functions are yet to be integrated into components - to do

// cart api calls

export const getCartItems = async (customerId, token) => {
  try {
    const { data } = await axios.get(
      `${endpoint}/cart?customerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const addGameToCart = async ({ customerId, gameId, price }, token) => {
  try {
    const { data } = await axios.post(
      `${endpoint}/cart/add?customerId=${customerId}&gameId=${gameId}&price=${price}`,
      null, // There should be no data object here
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const clearCart = async (customerId, token) => {
  try {
    const { data } = await axios.delete(
      `${endpoint}/cart/?customerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const removeItem = async ({
  gameId,
  customerId,
  price,
  cartId,
  token,
}) => {
  try {
    const { data } = await axios.delete(
      `${endpoint}/cart/remove?gameId=${gameId}&cartId=${cartId}&customerId=${customerId}&price=${price}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const incrementItemQuantity = async ({
  cartId,
  customerId,
  gameId,
  price,
  token,
}) => {
  try {
    const { data } = await axios.patch(
      `${endpoint}/cart?gamedId=${gameId}&cartId=${cartId}&customerId=${customerId}&price=${price}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

export const decrementItemQuantity = async ({
  cartId,
  customerId,
  gameId,
  price,
  token,
}) => {
  try {
    const { data } = await axios.patch(
      `${endpoint}/cart?gamedId=${gameId}&cartId=${cartId}&customerId=${customerId}&price=${price}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log("error:", error);
  }
};

// login api calls

// for storing login api response in the shape of my rtk slice
const transformResponse = (apiResponse) => {
  const { token, userInfo } = apiResponse;
  return {
    loading: false,
    isAuth: true,
    userInfo,
    error: null,
    token,
  };
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await axios.post(`${endpoint}/users/login`, credentials);
    console.log("the data is", data);
    // saves user session in localstorage on login

    const transformedData = transformResponse(data);
    localStorage.setItem("reduxStore", JSON.stringify(transformedData));

    return data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const register = async (credentials) => {
  try {
    const response = await axios.post(
      `${endpoint}/users/register`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const logout = async () => {
  try {
    await axios.post(`${endpoint}/users/logout/`);
  } catch (error) {
    console.log("There was an error logging out", error);
  }
};

// wishlist api calls

export const wishlists = async (customerId, token) => {
  try {
    const data = await axios.get(
      `${endpoint}/wishlists?customerId=${customerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};
export const singleWishlist = async (singleWishlistData) => {
  // const { token, id, userId } = singleWishlistData;
  const { token, wishlistId, userId } = singleWishlistData;

  console.log(token, wishlistId, userId);
  try {
    const { data } = await axios.get(
      // ` https://first-level-backend.onrender.com/wishlists/${id}?userId=${userId}`,
      ` ${endpoint}/wishlists/${wishlistId}?userId=${userId}`,

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
export const createWishlist = async (credentials) => {
  console.log("the credentials id are:", credentials);
  try {
    const data = await axios.post(
      `${endpoint}/wishlists/?customerId=${credentials.userId}`,
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
      `${endpoint}/wishlists/${id}?userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("checking delete wishlist data", data);
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};

// Not implemented
export const updateWishlist = async () => {
  try {
    const { data } = await axios.patch(`${endpoint}/games/wishlist`);
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};

export const addGamesOnWishlist = async (gameToAdd) => {
  console.log(gameToAdd);
  try {
    const { data } = await axios.post(
      `${endpoint}/wishlists/add?userId=${gameToAdd.userId}&wishlistId=${gameToAdd.wishlistId}`,

      {
        slug: gameToAdd.slug,
      },
      {
        headers: {
          Authorization: `Bearer ${gameToAdd.token}`,
        },
      }
    );
    console.log("the game data is", data);
    return data;
  } catch (error) {
    console.log("There was an error:", error);
  }
};

export const listOfGamesWishlist = async (gamesList) => {
  console.log(gamesList);
  const { userId, token, wishlistId } = gamesList;
  try {
    const { data } = await axios.get(
      // `https://first-level-backend.onrender.com/games/wishlist?userId=${userId}&wishlistId=${id}`,
      `${endpoint}/games/wishlist?userId=${userId}&wishlistId=${wishlistId}`,

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

export const deleteSingleGameFromWishlist = async (gameDetails) => {
  console.log(gameDetails);
  const { userId, token, wishlistId, slug } = gameDetails;
  try {
    const { data } = await axios.delete(
      `${endpoint}/wishlists/remove?userId=${userId}&wishlistId=${wishlistId}&slug=${slug}`,
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
