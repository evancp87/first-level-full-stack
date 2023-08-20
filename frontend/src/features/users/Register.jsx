import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateRegister } from "../../validation/index";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInState, setUser } from "./usersSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const notifyError = () => toast("There was an error registering");

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);

  const dispatch = useDispatch();
  const { isAuth, error, loading } = useSelector(selectLoggedInState);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  const handleInputs = async (e) => {
    const { name, value } = e.target;
    setRegister((inputs) => ({ ...inputs, [name]: value }));

    try {
      const payload = { [name]: value };
      const res = await validateRegister(payload);
      setErrors(res);
    } catch (error) {
      console.log("There was an error:", error);
      setErrors(error.details);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      dispatch(setUser(register));
      navigate("/login");
    } catch (error) {
      console.log("There was an error creating the user", error);
      notifyError();
    }
  };
  return (
    <section className="h-screen flex flex-col items-center justify-center">
      <div className="card sm:w-96 rounded-md border-2 bg-base-100 bg-base-100 p-4 shadow-xl">
        <div className="card-body  flex flex-col items-center text-center">
          <h2 className="card-title">Register</h2>
          <form
            className="flex flex-col gap-4"
            action="POST"
            onSubmit={handleRegister}
          >
            <input
              placeholder="name"
              type="text"
              name="name"
              value={register.name}
              onChange={handleInputs}
              className="rounded-md p-2 focus-input"
            />
            <div style={{maxWidth: "200px",minHeight: "2rem"}}>

            {errors &&
              errors.map((error, index) =>
                error.key === "name" ? (
                  <p key={index} className="logo-green">
                    {error.message}
                  </p>
                ) : null
              )}
</div>
            <input
              placeholder="email"
              type="text"
              name="email"
              value={register.email}
              onChange={handleInputs}
              className="rounded-md p-2 focus-input"
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
            <input
              placeholder="password"
              type="text"
              name="password"
              value={register.password}
              onChange={handleInputs}
              className="rounded-md p-2 focus-input"
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
                disabled={
                  loading ||
                  !register.name ||
                  !register.email ||
                  !register.password
                }
                className="active-btn text-slate-100 mx-2 w-[40%] px-4 cursor-pointer rounded-full bg-logo p-2 duration-300 ease-in-out hover:scale-110"
              >
                {loading ? "Loading..." : "Register"}
              </button>
              {error && (
                <p className="logo-green">
                  That email is already in use, please try again
                </p>
              )}
              <Link to="/login">
                <p className="mt-4">Already have an account?</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
