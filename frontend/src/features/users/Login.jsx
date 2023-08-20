import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateLogin } from "../../validation/index";
import { selectLoggedInState, loggedInUser } from "./usersSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const notifyError = () => toast("There was an error logging in");
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
    } catch (error) {
      console.log("There was an error logging in", error);
      notifyError();
    }
  };

  return (
    <section className="h-screen flex flex-col justify-center items-center">
      <div className="card sm:w-96 rounded-md border-2 bg-base-100 bg-base-100 p-4 shadow-xl">
        <div className="card-body flex flex-col items-center justify-center text-center">
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
              className="rounded-md p-2 focus-input"
              onChange={handleInputs}
            />
            <div style={{maxWidth: "200px",minHeight: "2rem"}}>
            {errors &&
              errors.map((error, index) =>
                error.key === "email" ? (
                  <p key={index} className="logo-green">
                    {error.message}
                  </p>
                ) : null
              )}
              </div>
            <label htmlFor="password"></label>
            <input
              placeholder="password"
              type="password"
              name="password"
              className="rounded-md p-2 focus-input"
              value={login.password}
              onChange={handleInputs}
            />
            <div style={{maxWidth: "200px",minHeight: "2rem"}}>

            {errors &&
              errors.map((error, index) =>
                error.key === "password" ? (
                  <p className="logo-green" key={index}>
                    {error.message}
                  </p>
                ) : null
              )}
              </div>

            <div className="card-actions flex-col">
              <button
                disabled={loading || !login.email || !login.password}
                className="active-btn text-slate-100 h-[40px] w-[40%] px-4 self-start rounded-full bg-logo duration-300 ease-in-out hover:scale-110"
              >
                {loading ? "Loading..." : "Login"}
              </button>
              {error && (
                <p className="logo-green">
                  We were unable to find that user, please try again
                </p>
              )}
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
