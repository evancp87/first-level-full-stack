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
import {Link} from "react-router-dom"



const Wishlist = () => {

  // unpacks slug from the url to dispatch the store and fetch game detail from api
  const { id } = useParams();

  // handles both adding to the cart and scroll to top


  // Object of game detail sent to the shopping cart

  const gameDetails = {
    name,
    background_image,
    id,
    price,
  };


 
  return (
    <section >
     <h3>Name of list</h3>

     <ul>
        {(likes.length === 0 && (
          <p className="mt-8 flex items-center justify-center text-xl">
            Nothing here. Like games to add to this section
          </p>
        )) ||
          []}
        {/* <TransitionGroup> */}
        {likes &&
          likes.map((game) => (
            <Transition
              key={game.id}
              timeout={200}
              in={true}
              onExit={onLikeExit}
              unmountOnExit
            >
              <li key={game.id}>
                <GameCard
                  game={game}
                  liked={game.liked}
                  handleLikes={handleLikes}
                />
              </li>
            </Transition>

            // wishlists.map here
            // each wishlist has an image of the first game in array
            // <Link to="/wishlist/`${id}`">
            // <WishlistPreview />
            // </Link>
            // 
            // 
          ))}
      </ul>
    </section>
  );
};

export default Wishlist;
