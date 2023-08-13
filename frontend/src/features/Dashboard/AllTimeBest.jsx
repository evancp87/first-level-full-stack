import React, { useEffect, useState } from "react";
import GameCard from "../Game/GameCard";
import { useSelector, useDispatch } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";

import { selectHighestRated, setTopRated } from "./dashboardSlice";

const AllTimeBest = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(setTopRated());
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [dispatch, setLoading]);

  // gets filtered list of highest rated games from store
  const highestRated = useSelector(selectHighestRated);
  console.log(highestRated);

  return (
    <div className="my-8 px-4 text-xl">
      <h2 className="my-4">All Time Highest Rated</h2>
      <ul>
        {loading ? ( // Display loading indicator while loading
          <PacmanLoader color="#36d7b7" loading={loading} />
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
