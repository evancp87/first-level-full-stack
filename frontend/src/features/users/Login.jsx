import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateLogin } from "../../validation/index";
import { selectLoggedInState, loggedInUser } from "./usersSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth, loading, error } = useSelector(selectLoggedInState);
  const [errors, setErrors] = useState(null);
  const [login, setLogin] = useState({
    password: "",
    email: "",
  });

  const handleInputs = async (e) => {
    const { name, value } = e.target;
    setLogin((inputs) => ({ ...inputs, [name]: value }));

    try {
      const payload = { [name]: value };
      const res = await validateLogin(payload);
      setErrors(res);
    } catch (error) {
      console.log("There was an error:", error);
    }
  };
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      dispatch(loggedInUser(login));
      // navigate(-1);
    } catch (error) {
      console.log("There was an error logging in", error);
    }
  };

  return (
    <section className="mt-4 flex flex-col items-center">
      <div className="card w-96 rounded-md border-2 bg-base-100 bg-base-100 p-4 shadow-xl">
        <div className="card-body flex flex-col items-center text-center">
          <h2 className="card-title">Login</h2>
          <form
            className="flex flex-col gap-4"
            action="POST"
            onSubmit={handleSubmit}
          >
            <label htmlFor="email"> </label>
            <input
              placeholder="email"
              type="text"
              name="email"
              value={login.email}
              className="rounded-md p-2"
              onChange={handleInputs}
            />
            {errors &&
              errors.map((error, index) =>
                error.key === "email" ? (
                  <p key={index} style={{ color: "#FF3E3E" }}>
                    {error.message}
                  </p>
                ) : null
              )}
            <label htmlFor="password"></label>
            <input
              placeholder="password"
              type="password"
              name="password"
              className="rounded-md p-2"
              value={login.password}
              onChange={handleInputs}
            />
            {errors &&
              errors.map((error, index) =>
                error.key === "password" ? (
                  <p key={index} style={{ color: "#FF3E3E" }}>
                    {error.message}
                  </p>
                ) : null
              )}

            <div className="card-actions">
              <button
                disabled={loading}
                className="active-btn text-slate-100 h-[40px] w-[25%] self-start rounded-full bg-logo duration-300 ease-in-out hover:scale-110"
              >
                {loading ? "Loading" : "Login"}
              </button>
              {error && <p>There was an error, please try again</p>}
              <Link className="mt-4" to="/register">
                <p>Don't have an account yet?</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
