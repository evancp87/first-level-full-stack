import React from "react";
import GameCard from "../Game/GameCard";
import { useHandleLikes } from "../../utils/hooks/localStorage.jsx";
import gsap from "gsap";
import { Transition } from "react-transition-group";
import {Link} from "react-router-dom"
import Wishlist from "./Wishlist";

import WishlistPreview from "./WishlistPreview";
import {Link} from "react-router-dom"

const WishlistList = () => {
  const { likes, handleLikes } = useHandleLikes();
  // const [isTransitioning, setIsTransitioning] = useState(false);
  // const wishlists = useSelector(selectWishLists)

  // TODO: not currently working- the idea being to animate out a game card on being removed from wishlist
  const onLikeExit = (node) => {
    gsap.to(node, {
      x: -100,
      delay: 0.2,
      ease: "power3",
      opacity: 0,
      stagger: {
        amount: 0.2,
      },
    });
  };

  return (
    <div>
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
                <Link to={`wishlist/${id}`}>
                <WishlistPreview
                  game={game}
                  liked={game.liked}
                  handleLikes={handleLikes}
                  />
                  </Link>
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
    </div>
  );
};

export default WishlistList;
