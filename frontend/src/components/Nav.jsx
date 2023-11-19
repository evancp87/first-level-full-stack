import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { selectItems, selectTotal } from "../features/cart/cartSlice";
import { selectLoggedInState } from "../features/users/usersSlice";
import { logoutUser } from "../features/users/usersSlice";
import Cart from "../features/cart/Cart";
import PacmanLoader from "react-spinners/PacmanLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Nav = () => {
  const notify = () => toast("You are now logged out");
  // const success = () => toast(`${}`)
  const items = useSelector(selectItems);
  // const count = useSelector(selectTotal);
  const { isAuth, userInfo, error, loading } = useSelector(selectLoggedInState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const handleLogout = () => {
    notify();
    setLoadingLogout(true);
    setTimeout(async () => {
      setLoadingLogout(false);

      dispatch(logoutUser());
      navigate("/");
    }, 1500);
  };

  return (
    <nav className="relative z-50 ms-[30px] flex flex-row  justify-between py-[2em]">
      <div>
        <Link to="/">
          <p className="logo-green cursor-pointer font-press">First Level</p>
        </Link>
      </div>
      <ul className="me-[30px] flex flex-row flex-wrap gap-x-[30px]">
        {loadingLogout && (
          <PacmanLoader color="#36d7b7" loading={loadingLogout} />
        )}
        {isAuth ? (
          <>
            <li>Welcome, {userInfo.name}</li>
            <li>
              <p to="/login" className="cursor-pointer" onClick={handleLogout}>
                Logout
              </p>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}

        <li>
          <Link to="/">
            <FontAwesomeIcon
              className="cursor-pointer duration-300 ease-in-out hover:scale-150"
              icon={faHouse}
            />
          </Link>
        </li>

        <li>
          <Link to="/wishlists">
            <FontAwesomeIcon
              className="cursor-pointer duration-300 ease-in-out hover:scale-150"
              icon={faHeart}
            />
          </Link>
        </li>
        <li>
          <div className="dropdown dropdown-end relative">
            {/* shopping cart - includes number of items in basket- conditional */}
            {items && items?.results?.length > 0 && (
              <p
                className="text-slate-100 absolute flex items-center justify-center"
                style={{
                  position: "absolute",
                  border: "2px solid orange",
                  top: "-10px",
                  backgroundColor: "orange",
                  left: "60%",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                }}
              >
                {items.results.length}
              </p>
            )}
            <label tabIndex={0} className=" m-1">
              <FontAwesomeIcon
                className="cursor-pointer duration-300 ease-in-out hover:scale-150"
                icon={faCartShopping}
              />
            </label>
            <div
              tabIndex={0}
              className="menu dropdown-content rounded-box z-[1] w-[200px] max-w-[300px] bg-base-100 p-2 shadow md:w-[300px]"
            >
              <Cart />
            </div>
          </div>
        </li>

        <li>
          <Link to="/search">
            <FontAwesomeIcon
              className="cursor-pointer duration-300 ease-in-out hover:scale-150"
              icon={faMagnifyingGlass}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
