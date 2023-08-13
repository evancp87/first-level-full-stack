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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  setWishlists,
  selectWishlists,
  addWishlist,
  selectSearch,
  search,
  reset,
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
  const notify = () => toast("The wishlist was deleted");

  useEffect(() => {
    const filteredWishlists = filteredSearch();
    // Calculate total pages for pagination
    setTotalPages(Math.ceil(filteredWishlists.length / 10));
    setCurrentPage(1);
  }, [searchInput]);

  // Gets list of wishlist names for dropdown

  const getWishlists = useCallback(() => {
    dispatch(setWishlists(userId));
  }, [setWishlists]);

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
    notify();
  };

  const filteredSearch = () => {
    // let filteredList = wishlists ? [...wishlists] : [];
    let filteredList = Array.isArray(wishlists) ? [...wishlists] : [];

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

    return { paginatedWishlists, totalWishlists: filteredList.length };
    // return filteredList;
  };

  const { paginatedWishlists } = filteredSearch();
  // const filteredWishlists = filteredSearch();
  const filteredWishlists = paginatedWishlists;
  useEffect(() => {
    const { totalWishlists } = filteredSearch();
    // Calculate total pages for pagination
    setTotalPages(Math.ceil(totalWishlists / 10));
    setCurrentPage(1);
  }, [searchInput]);

  const resetFilters = () => {
    dispatch(reset());
    setSearchText("");
  };

  console.log("checking total pages", totalPages);
  console.log("checking total pages", totalPages.length);

  return (
    <div className="flex  flex-col  items-center">
      <div className="w-80vw">
        <div className="my-1.5 flex flex-row flex-wrap justify-center ">
          <BackBtn />

          <div className="form-control  flex w-full justify-center">
            <label className="label self-start">
              <h2 className="label-text text-xl">{`${userInfo.name}'s wishlists`}</h2>
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
              className="active-btn text-slate-100 ml-[1.5em] h-[40px] w-[25%] justify-center self-start rounded-full bg-logo px-4 duration-300 ease-in-out hover:scale-110"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        <ul className="w-[100%]">
          {filteredWishlists && filteredWishlists.length > 0 && isAuth ? (
            filteredWishlists.map((wishlist, index) => (
              <li key={wishlist.id}>
                <article
                  key={wishlist.id}
                  className="mx-w-full card card-bordered card-side m-6 flex-row flex-wrap items-center bg-base-100 shadow-xl"
                >
                  <div className="card w-96 bg-primary text-primary-content">
                    <div className="card-body">
                      <h3 className="card-title">{wishlist.name}</h3>
                      <div className="card-actions flex items-center justify-end">
                        <Link to={`/wishlist/${wishlist.id}`}>
                          <button className="active-btn text-slate-100 h-[40px] self-start rounded-full bg-logo px-4 duration-300 ease-in-out hover:scale-110">
                            Wishlist
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleRemove(wishlist.id, token, userId)
                          }
                          className="active-btn btn h-[40px] rounded-full duration-300 ease-in-out hover:scale-110 "
                        >
                          delete
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
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))
          ) : (
            <p>No wishlists. Why not create some?</p>
          )}
        </ul>
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
            disabled={currentPage === totalPages || totalPages.length === 1}
            className="btn btn-outline join-item"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default WishlistList;
