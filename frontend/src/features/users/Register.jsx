import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateRegister } from "../../validation/index";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInState, setUser } from "./usersSlice";
const Register = () => {
  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);

  const dispatch = useDispatch();
  const { isAuth, userInfo, error, loading } = useSelector(selectLoggedInState);

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
      // navigate("/");
    } catch (error) {
      console.log("There was an error creating the user", error);
      setErrors([{ key: "registration", message: error.message }]);
      console.log("There was an error creating the user", error);
    }
  };
  return (
    <section className="mt-4 flex flex-col items-center justify-center">
      <div className="card w-96 rounded-md border-2 bg-base-100 bg-base-100 p-4 shadow-xl">
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
              className="rounded-md p-2"
            />
            {errors &&
              errors.map((error, index) =>
                error.key === "name" ? (
                  <p key={index} style={{ color: "#FF3E3E" }}>
                    {error.message}
                  </p>
                ) : null
              )}

            <input
              placeholder="email"
              type="text"
              name="email"
              value={register.email}
              onChange={handleInputs}
              className="rounded-md p-2"
            />
            {errors &&
              errors.map((error, index) =>
                error.key === "email" ? (
                  <p key={index} style={{ color: "#FF3E3E" }}>
                    {error.message}
                  </p>
                ) : null
              )}
            <input
              placeholder="password"
              type="text"
              name="password"
              value={register.password}
              onChange={handleInputs}
              className="rounded-md p-2"
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
              <button className="active-btn text-slate-100 mx-2 w-[100%] rounded-full bg-logo p-2 duration-300 ease-in-out hover:scale-110">
                {loading ? "Loading..." : "Register"}
              </button>
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
