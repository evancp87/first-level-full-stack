import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  selectItems,
  getItems,
  selectCount,
  removeFromCart,
  clear,
} from "./cartSlice";
// import { selectGameDetail } from "./GameSlice";
import { selectLoggedInState } from "../users/usersSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectItems);
  console.log("checking the items", items);
  // const totalAmount = useSelector(selectCount);
  const { isAuth, userInfo } = useSelector(selectLoggedInState);
  // const game = useSelector(selectGameDetail);
  // const { gameId, price, id } = game;
  const customerId = userInfo ? userInfo.id : null;
  const memoisedItems = useCallback(() => {
    if (isAuth) {
      dispatch(getItems(customerId));
    }
  }, [dispatch, getItems]);

  useEffect(() => {
    memoisedItems();
  }, [memoisedItems]);

  // handles interactions in cart with items
  const handleRemoveItem = (
    gameId,
    customerId,
    price,
    cartId
    // id
    // token,
  ) => {
    const gameToDelete = {
      gameId,
      customerId,
      price,
      cartId,
      // id,
      // token,
    };
    dispatch(removeFromCart(gameToDelete));
  };

  const handleClearCart = (customerId) => {
    dispatch(clear(customerId));
  };

  const handleCheckout = () => {
    alert("Thanks for purchasing!");
    dispatch(clear());
  };

  return (
    // if there are items loop over and show details, including price and total
    <div className="max-h-96 overflow-scroll">
      {items?.results?.length === 0 ? (
        <p className="flex justify-center" style={{ padding: "3em" }}>
          Your cart is empty
        </p>
      ) : (
        <div className="p-2">
          {items?.results?.map((item) => (
            <div key={item.id} className="my-4">
              <div>
                <div className="p-2">
                  <img
                    src={item.background_image}
                    alt="product img"
                    className="rounded-md"
                  />
                  <div>
                    <h3 className="my-2 text-lg">{item.gameName}</h3>
                    <div className="flex flex-row justify-between">
                      {/* if you keep adding the item to the basket the quantity goes up */}
                      <p>
                        £{item.gamePrice} x {item.quantity}
                      </p>
                      <div
                        className="flex self-end"
                        style={{ alignSelf: "end" }}
                      >
                        <FontAwesomeIcon
                          className="cursor-pointer"
                          icon={faTrashCan}
                          onClick={() =>
                            handleRemoveItem(
                              item.gameId,
                              customerId,
                              item.gamePrice,
                              item.cartId
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* total amount in basket */}
          <p className="my-2 p-2">Total: £{items?.finalTotal?.total}</p>
          <div className="mt-2">
            <button
              className="active-btn text-slate-100 mx-2 w-[30%] rounded-full bg-logo p-2 duration-300 ease-in-out hover:scale-110"
              onClick={() => handleClearCart(customerId)}
            >
              Clear
            </button>
            <button
              className="active-btn text-slate-100 mx-2 w-[30%] rounded-full bg-logo p-2 duration-300 ease-in-out hover:scale-110"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
