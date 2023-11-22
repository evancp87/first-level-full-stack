import React, { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";
import "../css/output.css";
import { Routes, Route } from "react-router-dom";
import Search from "./features/Dashboard/Search";
import Dashboard from "./features/Dashboard/Dashboard";
import GameDetail from "./features/Game/GameDetail";
import Error404 from "./components/Error404";
import Layout from "./components/Layout";
import Login from "./features/users/Login";
import Register from "./features/users/Register";
import Wishlist from "./features/wishlist/Wishlist";
import WishlistList from "./features/wishlist/WishlistList";
import "react-loading-skeleton/dist/skeleton.css";
import { setGames } from "./features/Dashboard/dashboardSlice";
import {
  selectHighestRated,
  selectNewReleases,
} from "./features/Dashboard/dashboardSlice";

const App = () => {
  const bodyRef = useRef(document.body);
  const highestRated = useSelector(selectHighestRated);
  const newReleases = useSelector(selectNewReleases);

  // handles styling of body while loading data from database
  useEffect(() => {
    const { current: body } = bodyRef;
    if (
      !highestRated ||
      !newReleases ||
      (highestRated.length === 0 || newReleases.length === 0)
    ) {
      body.style.pointerEvents = "none";
      body.style.opacity = "0.7";
    } else {
      body.style.pointerEvents = "auto";
      body.style.opacity = "1";
    }
  }, [highestRated, newReleases]);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // gets data and renders loading screen with state variable
  const getData = useCallback(async () => {
    setLoading(true);
    dispatch(setGames());
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [dispatch, setLoading]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <PacmanLoader color="#36d7b7" loading={loading} />
        </div>
      ) : (
        <>
          <Layout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/game/:slug" element={<GameDetail />} />
              <Route path="*" element={<Error404 />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wishlist/:id" element={<Wishlist />} />
              <Route path="/wishlists/" element={<WishlistList />} />
            </Routes>
          </Layout>
        </>
      )}
    </>
  );
};

export default App;
