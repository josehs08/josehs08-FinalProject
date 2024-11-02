import React, { useContext, useState } from "react";
import { Context } from "../../store/appContext";
import { Navigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const { actions, store } = useContext(Context);

  const initialState = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState(initialState);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const userInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      );

      if (userInfo.data) {
        const user = userInfo.data;
        try {
          const response = await axios.post(
            `${process.env.BACKEND_URL}/api/login-google`,
            {
              email: user.email,
              googleId: user.id,
            }
          );

          const data = response.data;
          if (response.status === 200) {
            localStorage.setItem("token", data.token);
            actions.getUserLogin();
          } else {
            alert("Google login failed");
          }
        } catch (error) {
          console.error("Google login error:", error);
          alert("Error logging in with Google");
        }
      }
    },
    onError: (error) => console.log("Google login failed:", error),
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await actions.login(user);
      if (response == true) {
        return <Navigate to="/profile" />;
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.log("An error ocurred during login:", error.message);
    }
  };

  return (
    <div className="container p-3">
      <h2 className="text-start">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="mail" className="form-label text-start w-100">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="mail"
            onChange={handleChange}
            name="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pass" className="form-label text-start w-100">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="pass"
            onChange={handleChange}
            name="password"
          />
        </div>
        <button className="w-100 btn btn-dark">Login</button>
      </form>
      <button
        className="w-100 btn btn-danger mt-3"
        onClick={() => googleLogin()}
      >
        Login with Google 🚀
      </button>
    </div>
  );
};
