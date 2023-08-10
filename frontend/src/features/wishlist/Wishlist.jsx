import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackBtn from "../../components/BackBtn";
import GameCard from "../Game/GameCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { useHandleLikes } from "../../utils/hooks/localStorage.jsx";
import gsap from "gsap";
import { Transition } from "react-transition-group";
import { Link } from "react-router-dom";
import { getWishlist, removeWishlist, update } from "./wishlistSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  // unpacks slug from the url to dispatch the store and fetch game detail from api
  const { id } = useParams();
  // TODO: get userId;
  // handles both adding to the cart and scroll to top

  // Object of game detail sent to the shopping cart

  useEffect(async () => {
    await dispatch(getWishlist(id));
  }, [id]);

  return (
    <section>
      {/* TODO: rerender wishlist name in useEffect */}
      <h3>Name of list</h3>
      <button onClick={handleRemoveWishlist}></button>

      <input type="text" />
      <button onClick={handleUpdateWishlist}></button>

      <ul>
        {(games.length === 0 && (
          <p className="mt-8 flex items-center justify-center text-xl">
            Nothing here. Like games to add to this section
          </p>
        )) ||
          []}
        {/* <TransitionGroup> */}
        {games &&
          games.map((game) => (
            <Transition
              key={game.id}
              timeout={200}
              in={true}
              onExit={onLikeExit}
              unmountOnExit
            >
              <Link to={`game/${game.id}`}>
                <li key={game.id}>
                  <GameCard
                    game={game}
                    liked={game.liked}
                    handleLikes={handleLikes}
                  />
                </li>
              </Link>
            </Transition>
          ))}
      </ul>
    </section>
  );
};

export default Wishlist;
