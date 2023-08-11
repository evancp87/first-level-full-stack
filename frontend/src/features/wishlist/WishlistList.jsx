import React, { useEffect, useCallback, useState } from "react";
import GameCard from "../Game/GameCard";
import { useHandleLikes } from "../../utils/hooks/localStorage.jsx";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { Transition } from "react-transition-group";
import { Link } from "react-router-dom";
import Wishlist from "./Wishlist";
import BackBtn from "../../components/BackBtn";
import { validate } from "../../validation/index";

import {
  setWishlists,
  selectWishlists,
  addWishlist,
  selectSearch,
  search,
  selectGamesOnWishlist,
  removeWishlist,
} from "./wishlistSlice";
import { selectLoggedInState } from "../users/usersSlice";

import { useNavigate } from "react-router-dom";

const WishlistList = () => {
  const dispatch = useDispatch();
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();
  const wishlists = useSelector(selectWishlists);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const { isAuth, userInfo, token } = useSelector(selectLoggedInState);
  const searchInput = useSelector(selectSearch);
  const [totalPages, setTotalPages] = useState(1);
  const userId = userInfo.id;
  console.log("checking in wishlist for userid", userId);

  const searchValue = async (e) => {
    if (searchInput) {
      setSearchText(e.target.value);
    }
    const { value } = e.target;
    dispatch(search(value));
    // joi validation
    const payload = { search: value };
    const res = await validate(payload);

    setSearchError(res);
  };

  // Gets list of wishlist names for dropdown

  const getWishlists = useCallback(async () => {
    await dispatch(setWishlists(userId));
  }, []);
  // rerenders selected wishlist based on selection from dropdown
  const getGamesOnWishlist = useCallback(async () => {
    const id = wishlists.data.findIndex((id, wishlist) => wishlist.id === id);
    const wishlistToFind = wishlists[id];
    const wishlistData = {
      userId,
      wishlistId: wishlistToFind,
    };
    await dispatch(selectGamesOnWishlist(wishlistData));
  }, [dispatch, selectGamesOnWishlist]);

  useEffect(() => {
    getGamesOnWishlist;
  }, [getGamesOnWishlist]);

  useEffect(() => {
    if (isAuth) {
      getWishlists();
    } else {
      navigate("/login");
    }
  }, [isAuth]);

  const handleRemove = (wishlistId) => {
    console.log(token);
    console.log(wishlistId);
    dispatch(removeWishlist({ id: wishlistId, token, userId }));
  };

  // TODO: not currently working- the idea being to animate out a game card on being removed from wishlist
  // const onLikeExit = (node) => {
  //   gsap.to(node, {
  //     x: -100,
  //     delay: 0.2,
  //     ease: "power3",
  //     opacity: 0,
  //     stagger: {
  //       amount: 0.2,
  //     },
  //   });
  // };
  const filteredSearch = () => {
    let filteredList = [...wishlists];

    // defensive checks for rendering filtered list based on input
    if (searchInput) {
      console.log("is there a searchInput:", searchInput);
      filteredList = filteredList.filter((wishlist) => {
        const wishlistQuery = wishlist.name
          .toLowerCase()
          .includes(searchInput.toLowerCase());

        return wishlistQuery;
      });
    }

    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedWishlists = filteredList.slice(startIndex, endIndex);

    return paginatedWishlists;
    // return filteredList;
  };

  const filteredWishlists = filteredSearch();

  useEffect(() => {
    const filteredWishlists = filteredSearch();
    // Calculate total pages for pagination
    setTotalPages(Math.ceil(filteredWishlists.length / 10));
    setCurrentPage(1);
  }, [searchInput]);

  return (
    <div className="flex max-w-[80vw] flex-col  items-center">
      <div className="my-1.5 flex flex-row flex-wrap justify-center ">
        <BackBtn />

        <div className="form-control  flex w-full justify-center">
          <label className="label self-start">
            <span className="label-text">Search for wishlists</span>
          </label>
          <input
            onChange={searchValue}
            value={searchText}
            type="text"
            placeholder="Search wishlists"
            className="focus-input max-w-xs input input-bordered my-[1.5em] w-full"
          />
          <ul>
            {searchError &&
              searchError.map((error, index) => (
                <li key={index}>
                  <p className="mb-4 text-logo"> {error.message}</p>
                </li>
              ))}
          </ul>
          <button
            value="reset"
            className="active-btn text-slate-100 h-[40px] w-[25%] self-start rounded-full bg-logo duration-300 ease-in-out hover:scale-110"
            // onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {filteredWishlists && filteredWishlists.length > 0 && isAuth ? (
        filteredWishlists.map((wishlist, index) => (
          <>
            <article
              key={wishlist.id}
              className="mx-w-full card card-bordered card-side m-6 flex-row flex-wrap items-center bg-base-100 shadow-xl"
            >
              <div className="card w-96 bg-primary text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">{wishlist.name}</h2>
                  <div className="card-actions justify-end">
                    <Link to={`/wishlist/${wishlist.id}`}>
                      <button>Wishlist</button>
                    </Link>
                    <button
                      onClick={() => handleRemove(wishlist.id, token, userId)}
                      className="btn"
                    >
                      delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </>
        ))
      ) : (
        <p>Wishlists will appear here when created</p>
      )}
      <div className="join my-[3em] grid grid-cols-2  pe-[1em] ps-[1em]">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1 || filteredWishlists.length === 0}
          className="btn btn-outline join-item"
        >
          Previous page
        </button>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage > totalPages || filteredWishlists.length === 0}
          className="btn btn-outline join-item"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default WishlistList;
