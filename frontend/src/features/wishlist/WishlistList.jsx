import React, { useEffect, useCallback } from "react";
import GameCard from "../Game/GameCard";
import { useHandleLikes } from "../../utils/hooks/localStorage.jsx";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { Transition } from "react-transition-group";
import { Link } from "react-router-dom";
import Wishlist from "./Wishlist";
import {
  setWishlists,
  selectWishlists,
  addWishlist,
  addGamesToWishlist,
} from "./wishlistSlice";
import { selectLoggedInState } from "../users/usersSlice";

const WishlistList = () => {
  const dispatch = useDispatch();
  const { isAuth, userInfo } = useSelector(selectLoggedInState);
  const userId = userInfo.userId;
  const wishlists = useSelector(selectWishlists);

  // const { likes, handleLikes } = useHandleLikes();
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

  const getWishlists = useCallback(async () => {
    await dispatch(setWishlists());
  }, []);

  // Gets list of wishlist names for dropdown
  useEffect(() => {
    getWishlists(userId);
  }, [getWishlists]);

  // rerenders selected wishlist based on selection from dropdown
  useEffect(() => {
    getWishlists(userId);
  }, [getWishlists]);

  return (
    <div>
      <ul>
        {wishlists.map((wishlist) => {
          <li>{wishlist.name}</li>;
        })}

        <Wishlist />
      </ul>
    </div>
  );
};

export default WishlistList;
