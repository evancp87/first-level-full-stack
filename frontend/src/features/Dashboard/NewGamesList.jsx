import React, { useEffect, useCallback } from "react";
import NewGame from "./NewGame";
import { oneMonthAgo, currentDate } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { selectNewReleases, setGamesByDate } from "./dashboardSlice";
import NewGameSkeletonCard from "../../components/NewGameSkeletonCard";

const FilteredList = () => {
  const dispatch = useDispatch();
  const newReleases = useSelector(selectNewReleases);

  const handleGetGames = useCallback(() => {
    // dispatches current date and date a month ago as parameters to games released recently api call
    dispatch(
      setGamesByDate({
        startDate: oneMonthAgo,
        endDate: currentDate,
      })
    );
  }, [dispatch, setGamesByDate]);

  useEffect(() => {
    handleGetGames();
  }, [handleGetGames]);

  return (
    <>
      <h2 className="my-4 px-4 text-xl">Latest Games</h2>

      <ul className="carousel carousel-center rounded-box space-x-2 overflow-y-hidden px-4 ">
        {!newReleases ? (
          <div className="my-[5em]">
            <p className="my-[1em] text-logo">
              No newly released games available right now
            </p>
            <NewGameSkeletonCard />
          </div>
        ) : newReleases && newReleases.length > 0 ? (
          newReleases.map((game) => (
            <li className="carousel-item cursor-move" key={game.id}>
              <NewGame game={game} />
            </li>
          ))
        ) : (
          <NewGameSkeletonCard />
        )}
      </ul>
    </>
  );
};

export default FilteredList;
