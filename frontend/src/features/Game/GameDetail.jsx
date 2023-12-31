import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BackBtn from "../../components/BackBtn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getGame,
  getGameScreenshots,
  selectGameDetail,
  selectScreenshots,
} from "./GameSlice";
import { truncateText } from "../../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";
import { addToCart } from "../cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { selectLoggedInState } from "../users/usersSlice";

const GameDetail = () => {
  const [showMore, setShowMore] = useState(false);
  const gameDetailRef = useRef(null);
  const parallaxRef = useRef(null);
  const dispatch = useDispatch();
  const game = useSelector(selectGameDetail);
  const screenshots = useSelector(selectScreenshots);
  const navigate = useNavigate();
  const { isAuth, userInfo } = useSelector(selectLoggedInState);
  const customerId = userInfo ? userInfo.id : null;

  // unpacks slug from the url to dispatch the store and fetch game detail from api
  const { slug } = useParams();
  const notify = () => toast(`Your game was added to the basket`);
  const fetchGame = useCallback(() => {
    dispatch(getGame(slug));
    dispatch(getGameScreenshots(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  // parallax effect
  useEffect(() => {
    const handleScroll = () => {
      let offset = window.pageYOffset;
      parallaxRef.current.style.backgroundPositionY = offset * 0.7 + "px";
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const {
    released,
    name,
    background_image,
    rating,
    platforms,
    genres,
    developers,
    description,
    price,
  } = game;


  const handleAddToCart = async (game) => {
    if (isAuth) {
      const action = await dispatch(addToCart(game));
      if (action.type === addToCart.fulfilled.type) {
        notify();
        gameDetailRef.current.scrollIntoView({
          behavior: "smooth",
        });
      } else if (action.type === addToCart.rejected.type) {
        const errorNotify = () => toast(action.error.message);
        errorNotify();
        gameDetailRef.current.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
      navigate("/login");
    }
  };

  // Object of game detail sent to the shopping cart
  const gameId = game.id;
  const gameDetails = {
    // name,
    customerId,
    gameId,
    price,
  };
  console.log("the game details are", gameDetails);
  // regex handles issue with the description property being html in json format, by adding a class to the p tag so the text can be styled
  const tidyHtml = /<p>/gi;
  const tidiedDescription = description
    ? description
        .replaceAll(tidyHtml, "<p class='my-4'>")
        .replaceAll(/<br>/gi, "<br><br>")
    : "";

  // truncated descriptions for long blocks of text
  const truncatedDescription = truncateText(tidiedDescription, 500);
  const isTooLong = truncatedDescription.length < tidiedDescription.length;

  const platformNames =
    platforms && platforms.map((console) => console.platform.name).join(", ");

  const developerNames =
    developers && developers.map((developer) => developer.name).join(", ");
  const genreNames = genres && genres.map((genre) => genre.name).join(", ");

  return (
    <section ref={gameDetailRef}>
      <header
        ref={parallaxRef}
        style={
          background_image && {
            backgroundImage: `url(${background_image})`,
            height: 500,
            backgroundPosition: "top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
          }
        }
      >
        <BackBtn />
        <ToastContainer />
      </header>

      <section className="flex flex-col items-center px-[3em]">
        <div className="mt-6 flex flex-col items-center gap-4 ">
          <p className="text-center text-4xl"> {name}</p>
          <p>{developerNames}</p>
          <p>{released}</p>
          <p>{platformNames}</p>
          <p>{genreNames}</p>
        </div>
        {/* toggles between short and long copy */}
        <div className="w-full">
          {showMore ? (
            <div>{parse(tidiedDescription)}</div>
          ) : (
            <div> {parse(truncatedDescription)}</div>
          )}

          {/* handles situations where the copy isn't long and truncate button not needed */}
          {isTooLong && (
            <button
              className="active-btn text-slate-100 flex h-[40px] w-[200px] items-center justify-center rounded-full
           bg-logo duration-300 ease-in-out hover:scale-110"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
          <div className="mt-6 flex flex-row flex-wrap items-center justify-between">
            <div className="mt-4 flex justify-between gap-4 ">
              <button
                className="active-btn btn flex min-w-[200px] justify-evenly rounded-full  duration-300 ease-in-out hover:scale-110"
                onClick={() => handleAddToCart(gameDetails)}
              >
                <FontAwesomeIcon
                  icon={faCartPlus}
                  size="2x"
                  className="cursor-pointer"
                />
                £{price}
              </button>
            </div>
            <p className="mt-4 text-xl">Rating: {rating}</p>
          </div>
        </div>
      </section>

      <section className="my-6 py-[2em]">
        {/* carousel of screenshots */}
        <div className="w-full overflow-x-auto">
          <ul
            className="carousel carousel-center rounded-box  space-x-2 overflow-y-hidden p-4"
            style={{ height: 300 }}
          >
            {screenshots &&
              screenshots.map((screenshot, index) => (
                <li
                  className="carousel-item w-[200px] cursor-move gap-[1em]  shadow-xl md:w-96"
                  style={{ height: 300 }}
                  key={screenshot.id}
                >
                  <img
                    className="rounded-box object-cover"
                    src={screenshot.image}
                    alt={`${name} screenshot ${index} `}
                    key={screenshot.id}
                  />
                </li>
              ))}
          </ul>
        </div>
      </section>
    </section>
  );
};

export default GameDetail;
