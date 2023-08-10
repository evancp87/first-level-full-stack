import React, { useRef, useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setWishlists,
  selectWishlists,
  addWishlist,
  addGamesToWishlist,
} from "./wishlistSlice";
import { useNavigate } from "react-router-dom";
import { selectLoggedInState } from "../users/usersSlice";

const WishlistModal = ({ name, slug }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlists = useSelector(selectWishlists);
  const [selectedWishlists, setSelectedWishlists] = useState([]);

  const { isAuth, userInfo, token } = useSelector(selectLoggedInState);
  const [wishlistName, setWishlistName] = useState("");
  const userId = userInfo.id;
  console.log("the user id is", userId);
  const getWishlists = useCallback(async () => {
    await dispatch(setWishlists(userId));
  }, []);

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
      console.log(wishlistId);
    } else {
      setSelectedWishlists((inputs) =>
        inputs.filter((id) => id !== wishlistId)
      );
    }
  };

  const setCreateWishlistInput = (e) => {
    setWishlistName(e.target.value);
  };

  // loop over checked options and insert into wishlist games table
  const handleSaveToWishlist = () => {
    for (const wishlistId of selectedWishlists) {
      const gameToSave = { userId, wishlistId, slug, token };
      dispatch(addGamesToWishlist(gameToSave));
    }
    navigate("/wishlists");
  };

  const handleCreateWishlist = async (e) => {
    const wishlistWithGame = {
      name: wishlistName,
      slug,
    };

    console.log("the details are:", wishlistWithGame);
    await dispatch(addWishlist({ userId, token, wishlistWithGame }));
    navigate("/favorites");
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
      <button className="btn" onClick={showModal}>
        Add to wishlist
      </button>
      <dialog ref={modalRef} className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
            ✕
          </button>

          <div className="mb-4">
            <h3>Save to</h3>
          </div>
          <div className="max-w-[70%]">
            {/* map over wishlists here */}
            <ul className="min-h-[100px]">
              {wishlists && isAuth && wishlists.length > 0 ? (
                wishlists.data.map((list, index) => (
                  <li key={index} className="flex  gap-4 overflow-scroll">
                    <input
                      type="checkbox"
                      className="h-[20px] w-[20px]"
                      value={selectedWishlists}
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
              onClick={handleSaveToWishlist}
              className="hover:bg-slate-100 btn self-end border-0 bg-transparent hover:rounded-full hover:border-2"
            >
              Save
            </button>
          </div>

          <div className="mt-4 ">
            <div className="flex flex-col">
              <h4>Create wishlist</h4>
              <p className="mt-4 w-[20px]">+</p>
              <div className="flex flex-col justify-center">
                <div className="mt-4 flex flex-row">
                  <h3>Name</h3>
                  <input
                    type="text"
                    value={wishlistName}
                    onChange={setCreateWishlistInput}
                    className="border-b-2 border-dashed bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="hover:bg-slate-100 btn self-end border-0 bg-transparent hover:rounded-full hover:border-2"
                  onClick={handleCreateWishlist}
                >
                  Create
                </button>
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
