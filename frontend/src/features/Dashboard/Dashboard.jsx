import React from "react";
import AllTimeBest from "./AllTimeBest";
import NewGamesList from "./NewGamesList";
import { useSelector } from "react-redux";
import { selectHighestRated, selectNewReleases } from "./dashboardSlice";
import PacmanLoader from "react-spinners/PacmanLoader";

const Dashboard = () => {
  const highestRated = useSelector(selectHighestRated);
  const newReleases = useSelector(selectNewReleases);
  return (
    <>
      {(!highestRated && !newReleases) ||
        (highestRated &&
          highestRated.length === 0 &&
          newReleases !== undefined &&
          newReleases.length === 0 && (
            <>
              <p
                className=" text-logo"
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  zIndex: "2000",
                }}
              >
                Loading content...
              </p>
              <PacmanLoader color="#36d7b7" />
            </>
          ))}
      <NewGamesList />
      <AllTimeBest />
    </>
  );
};

export default Dashboard;
