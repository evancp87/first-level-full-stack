import React, { useEffect } from "react";
import GameCard from "../Game/GameCard";
import { useSelector, useDispatch } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";

import { selectHighestRated, setTopRated } from "./dashboardSlice";

const AllTimeBest = () => {
  const dispatch = useDispatch();

  // gets list of top rated games
  useEffect(() => {
    dispatch(setTopRated());
  }, [dispatch]);

  // gets filtered list of highest rated games from store
  const highestRated = useSelector(selectHighestRated);
  console.log(highestRated);

  return (
    <div className="my-8 px-4 text-xl">
      <h2 className="my-4">All Time Highest Rated</h2>
      <ul>
        {!highestRated ? (
          <PacmanLoader color="#36d7b7" />
        ) : highestRated && highestRated.length > 0 ? (
          highestRated.map((game, index) => (
            <li key={game.id}>
              <GameCard game={game} index={index} />
            </li>
          ))
        ) : (
          <p>Highest Rated Games not Available</p>
        )}
      </ul>
    </div>
  );
};

export default AllTimeBest;
