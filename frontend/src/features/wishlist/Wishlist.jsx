import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackBtn from "../../components/BackBtn";
import GameCard from "../Game/GameCard";

import { Transition } from "react-transition-group";
import { Link } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import {
  getWishlist,
  getGamesFromWishlist,
  selectSingleWishlist,
  selectGamesOnWishlist,
} from "./wishlistSlice";
import { selectLoggedInState } from "../users/usersSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // unpacks slug from the url to dispatch the store and fetch game detail from api
  const { id } = useParams();

  const { isAuth, userInfo, token } = useSelector(selectLoggedInState);
  const games = useSelector(selectGamesOnWishlist);
  const wishlist = useSelector(selectSingleWishlist);
  console.log(wishlist);

  // TODO: get userId;
  // handles both adding to the cart and scroll to top

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

  const fetchWishlist = useCallback(async () => {
    await dispatch(getWishlist(wishlistDetails));
    await dispatch(getGamesFromWishlist(wishlistDetails));
  }, [dispatch, getWishlist]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  return (
    <section>
      <BackBtn />
      {/* TODO: rerender wishlist name in useEffect */}
      <h3>{wishlist.name}</h3>

      <ul>
        {(games.length === 0 && (
          <p className="mt-8 flex items-center justify-center text-xl">
            Nothing here. Like games to add to this section
          </p>
        )) ||
          []}
        <TransitionGroup>
          {games &&
            games.map((game) => (
              <Transition
                key={game.id}
                timeout={200}
                in={true}
                // onExit={onLikeExit}
                // unmountOnExit
              >
                <Link to={`game/${game.id}`}>
                  <li key={game.id}>
                    <GameCard
                      game={game}
                      liked={game.liked}
                      // handleLikes={handleLikes}
                    />
                  </li>
                </Link>
              </Transition>
            ))}
        </TransitionGroup>
      </ul>
    </section>
  );
};

export default Wishlist;
