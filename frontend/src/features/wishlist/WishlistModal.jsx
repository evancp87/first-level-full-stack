/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setWishlists,
  selectWishlists,
  addWishlist,
  addGamesToWishlist,
  selectGamesOnWishlist,
  getGamesFromWishlist,
} from "./wishlistSlice";
import { useNavigate } from "react-router-dom";
import { selectLoggedInState } from "../users/usersSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { escapeForRegExp } from "../../utils/helpers";

const WishlistModal = ({ slug }) => {
  const notify = () => toast("Your wishlist was created");
  const notifySaved = () => toast("Your game was saved");
  const notifyFailed = () => toast("Your game is already on that wishlist");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlists = useSelector(selectWishlists);
  const [selectedWishlists, setSelectedWishlists] = useState([]);
  const { isAuth, userInfo, token } = useSelector(selectLoggedInState);
  const [wishlistName, setWishlistName] = useState("");
  const userId = userInfo?.id;
  const games = useSelector(selectGamesOnWishlist);

  // sets wishlists on modal inputs
  const getWishlists = useCallback(() => {
    dispatch(setWishlists(userId));
  }, [setWishlists, dispatch]);

  // check for logged in user = disables add to wishlist button if not
  useEffect(() => {
    if (isAuth) {
      getWishlists();
    }
  }, [isAuth]);

  const modalRef = useRef(null);

  const setInputs = (e, wishlistId) => {
    // map over the wishlists and for each wishlist that is checked
    const isChecked = e.target.checked;
    // check if checked and add to array of checked options, or if not exclude
    if (isChecked) {
      setSelectedWishlists((inputs) => [...inputs, wishlistId]);
      // gets latest games on list
      dispatch(getGamesFromWishlist({ wishlistId, userId, token }));
    } else {
      setSelectedWishlists((inputs) =>
        inputs.filter((id) => id !== wishlistId)
      );
    }
  };
  // sanitising wishlist name
  const setCreateWishlistInput = (e) => {
    setWishlistName(escapeForRegExp(e.target.value));
  };

  // loop over checked options and insert into wishlist games table
  const handleSaveToWishlist = async () => {
    for (const wishlistId of selectedWishlists) {
      const gameToSave = { userId, wishlistId, slug, token };

      const duplicateGame = games.some(
        (game) =>
          game.wishlist_id === wishlistId && game.slug === gameToSave.slug
      );
      // if the game is already on the wishlist then don't add, otherwise add to the list
      if (duplicateGame) {
        notifyFailed();
      } else {
        notifySaved();
        dispatch(addGamesToWishlist(gameToSave));
        // updates games on list
        dispatch(getGamesFromWishlist({ wishlistId, userId, token }));
      }
      setSelectedWishlists([]);
    }
    // navigate("/wishlists");
  };

  // creates wishlists
  const handleCreateWishlist = async () => {
    const wishlistWithGame = {
      name: wishlistName,
      slug,
    };

    notify();
    setWishlistName("");
    dispatch(addWishlist({ userId, token, wishlistWithGame }));
    // gets the new wishlist name instantly
    getWishlists(userId);
    // navigate("/favorites");
  };

  const showModal = () => {
    // checks if the user is authenticated
    if (isAuth && wishlists !== null) {
      if (modalRef.current) {
        modalRef.current.showModal();
        // if authenticated open the modal
      }
    } else {
      navigate("/login");
      // if not authenticated, redirect to login
    }
  };

  return (
    <div className="relative">
      <button
        className="active-btn text-sm text-slate-100 mt-4 h-[40px] rounded-full  bg-logo px-4 duration-300 ease-in-out hover:scale-110"
        onClick={showModal}
      >
        Add to wishlist
      </button>
      <dialog ref={modalRef} className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>

          <div className="mb-4">
            <h3 className="text-xl">Save to</h3>
          </div>
          <div className=" max-w-[95%]">
            {/* map over wishlists here */}
            <ul className=" h-56 overflow-scroll border-b-2 border-dashed pr-4">
              {wishlists && isAuth && wishlists.length > 0 ? (
                wishlists.map((list, index) => (
                  <li
                    key={index}
                    className="flex  items-center justify-between gap-4 "
                  >
                    <input
                      type="checkbox"
                      className="h-[20px] w-[20px] cursor-pointer"
                      value={list.id}
                      onChange={(e) => setInputs(e, list.id)}
                      checked={selectedWishlists.includes(list.id)}
                    />
                    <h4>{list.name}</h4>
                  </li>
                ))
              ) : (
                <p>Create wishlists below</p>
              )}
            </ul>
            <button
              // onClick={handleAddGameWishlist}
              disabled={selectedWishlists.length === 0}
              onClick={handleSaveToWishlist}
              className="active-btn text-slate-100 mt-4 h-[40px] cursor-pointer rounded-full  bg-logo px-4 duration-300 ease-in-out hover:scale-110"
            >
              Save
            </button>
            {/* <ToastContainer /> */}
          </div>

          <div className="mt-4 ">
            <div className="flex flex-col">
              <h3 className="mt-4 text-xl">Or create a new wishlist</h3>

              <div className="flex flex-col ">
                <div className="mt-4 flex flex-row justify-between flex-wrap">
                  <input
                    type="text"
                    value={wishlistName}
                    onChange={setCreateWishlistInput}
                    className=" border-b-2 border-dashed bg-transparent"
                  />
                  <button
                    disabled={!wishlistName}
                    type="button"
                    className="active-btn text-slate-100 flex h-[40px] cursor-pointer items-center rounded-full  bg-logo p-4 px-4 duration-300 ease-in-out hover:scale-110 mt-4 sm:mt-0"
                    onClick={handleCreateWishlist}
                  >
                    Create Wishlist
                  </button>
                </div>
                {/* <ToastContainer /> */}
              </div>
            </div>
            {/* {showAddWishlist && (
)} */}
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default WishlistModal;
