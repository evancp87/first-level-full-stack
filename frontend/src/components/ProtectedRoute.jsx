import React from "react";
import { Route, Navigate } from "react-router-dom";
import { selectLoggedInState } from "../features/users/usersSlice";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ ...props }) => {
  const { isAuth } = useSelector(selectLoggedInState);
  if (isAuth) {
    return <Route {...props} />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
