import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackBtn from "../../components/BackBtn";
import GameCard from "../Game/GameCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Transition } from "react-transition-group";
import { Link } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import {
  getWishlist,
  getGamesFromWishlist,
  selectSingleWishlist,
  selectGamesOnWishlist,
  deleteGame,
} from "./wishlistSlice";
import { selectLoggedInState } from "../users/usersSlice";

const Wishlist = () => {
  const notify = () => toast("The game was deleted");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // unpacks slug from the url to dispatch the store and fetch game detail from api
  const { id } = useParams();

  const { isAuth, userInfo, token } = useSelector(selectLoggedInState);
  const games = useSelector(selectGamesOnWishlist);

  console.log(games);
  const wishlist = useSelector(selectSingleWishlist);
  console.log(wishlist);

  // TODO: get userId;
  // handles both adding to the cart and scroll to top
  // const wishlistId = wishlist;
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth]);

  const userId = userInfo.id;

  console.log(userId);

  const wishlistDetails = {
    userId,
    token,
    id,
  };

  const handleDelete = (wishlistId, token, userId, slug) => {
    console.log(token);
    console.log(wishlistId);
    console.log(slug);
    console.log(userId);
    console.log(typeof token);
    console.log(typeof wishlistId);
    console.log(typeof slug);
    console.log(typeof userId);
    dispatch(deleteGame({ wishlistId, token, userId, slug }));
    notify();
  };

  const fetchWishlist = useCallback(async () => {
    await dispatch(getWishlist(wishlistDetails));
    await dispatch(getGamesFromWishlist(wishlistDetails));
  }, [dispatch, getWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <section className="flex flex-col items-center">
      <div className="w-[90%]">
        <BackBtn />
        <div className="ml-6 mt-16 flex">
          <h2 className="mt-[5em] text-xl">{wishlist.name}</h2>
        </div>

        <ul>
          {(games.length === 0 && (
            <p className="mt-8 flex items-center justify-center text-xl">
              Nothing here. Like games to add to this section
            </p>
          )) ||
            []}
          {games &&
            games.map((game) => (
              <>
                <li key={game.id}>
                  <Link to={`game/${game.id}`}>
                    <GameCard
                      game={game}
                      liked={game.liked}
                      // handleLikes={handleLikes}
                    />
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(Number(id), token, userId, game.slug)
                    }
                    className="active-btn text-slate-100 ml-6 h-[40px] rounded-full  bg-logo px-4 duration-300 ease-in-out hover:scale-110"
                  >
                    Delete {game.name}
                  </button>
                  <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    draggable
                    pauseOnHover
                    theme="colored"
                  />
                </li>
              </>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Wishlist;
