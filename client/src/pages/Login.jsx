import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userActions } from "../store/user-slice";
import { toast } from "react-toastify";

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  // Function to change userData
  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        userData
      );
      // console.log("Login Successful", response.data);
      if (response.status == 200) {
        dispatch(userActions.changeCurrentUser(response?.data));
        localStorage.setItem("currentUser", JSON.stringify(response?.data));
        navigate("/");
      }

      toast.success(response?.data?.message || "Login successfully!");
    } catch (error) {
      // setError(error.response?.data?.message);
      console.log(error)
      setLoading(false);
    }
  };

  return (
    <section className="register">
      <div className="container register__container">
        <h2>Sign In</h2>
        <form onSubmit={loginUser}>
          {error && (
            <p className="form__error-message">
              Something went wrong. Please try again
            </p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={changeInputHandler}
          />

          <div className="password__controller">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="password"
              onChange={changeInputHandler}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <p>
            Don't have an account? <Link to="/register">Sign Up</Link>{" "}
          </p>

          <button disabled={loading} type="submit" className="btn primary">
            {loading ? "Login..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
