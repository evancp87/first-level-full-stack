/* eslint-disable react/prop-types */

import React from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WishlistModal from "../wishlist/WishlistModal";
import { ToastContainer } from "react-toastify";

const GameCard = ({ game, index }) => {
  const { released, name, background_image, slug, rating, platforms } = game;

  let platformNames;
  
  if (platforms) {
    if (Array.isArray(platforms)) {
      platformNames = platforms.join(", ");
    } else if (typeof platforms === "object") {
      platformNames = Object.values(platforms).join(", ");
    }
  }

  return (
    <>
      <SkeletonTheme color="#f3f3f3" highlightColor="#e0e0e0">
        <article className="mx-w-full card card-bordered card-side m-6 flex-row flex-wrap items-center card-bg shadow-xl">
          <picture className="rounded-sm sm:max-w-[100%] lg:max-w-[20%]">
            <Link to={`/game/${slug}`}>
              {background_image ? (
                <img className="rounded-xl" src={background_image} alt={name} />
              ) : (
                <Skeleton width={100} count={3} />
              )}
            </Link>
          </picture>

          <div className="card-body">
            <div className="flex flex-col gap-4 ">
              <h2 className="card-title text-xl">{name}</h2>
              <p>
                {game ? (
                  `Released ${new Date(released).toDateString()}`
                ) : (
                  <Skeleton count={1} />
                )}
              </p>
              <p className="text-sm">
                {game ? platformNames : <Skeleton count={1} />}
              </p>
            </div>
            <div className="flex items-center">
              {/*opens wishlist modal for creating and adding to wishlists */}
              <WishlistModal name={name} slug={slug} />
              <p className="card-actions justify-end">
                {game ? `Rating: ${rating}` : <Skeleton count={1} />}{" "}
              </p>
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={true}
                pauseOnHover
                theme="colored"
              />
            </div>
          </div>
        </article>
      </SkeletonTheme>
    </>
  );
};

export default GameCard;
