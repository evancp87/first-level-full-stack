import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";
import "../dist/output.css";
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
// import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
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
