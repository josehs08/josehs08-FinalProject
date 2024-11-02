import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../store/appContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { BiMailSend } from "react-icons/bi";

export const Register = () => {
  const { actions } = useContext(Context);
  const initialState = {
    first_name: "",
    last_name: "",
    email: "",
    foto: "",
    password: "",
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const userInfo = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`
      );

      const user = userInfo.data;
      try {
        const response = await axios.post(
          `${process.env.BACKEND_URL}/api/register-google`,
          {
            email: user.email,
            first_name: user.given_name,
            last_name: user.family_name,
            foto: user.picture,
            google_id: user.id,
            email: user.email,
          }
        );
        if (response.status === 201) {
          alert("User created via Google");
        } else {
          alert("User already exists or failed to create via Google");
        }
      } catch (error) {
        console.error("Google registration error:", error);
        alert("Error registering user via Google");
      }
    },
    onError: (error) => console.log("Google login failed:", error),
  });

  const [user, setUser] = useState(initialState);
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", user.first_name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("last_name", user.last_name);
    formData.append("foto", user.foto);

    try {
      const response = await actions.register(formData);
      if (response) {
        alert("User created");
        setUser(initialState);
      } else {
        alert("User not created");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating user");
    }
  };

  return (
    <div className="container p-3">
      <h2 className="text-start">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between">
          <div className="mb-3 w-50 me-3">
            <label htmlFor="firstName" className="form-label text-start w-100">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              onChange={handleChange}
              value={user.firstName}
              name="first_name"
              placeholder="John"
            />
          </div>
          <div className="mb-3 w-50">
            <label htmlFor="lastName" className="form-label text-start w-100">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              onChange={handleChange}
              value={user.lastName}
              name="last_name"
              placeholder="Doe"
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-start w-100">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            onChange={handleChange}
            value={user.email}
            name="email"
            placeholder="m@example.com"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label text-start w-100">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={handleChange}
            value={user.password}
            name="password"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="foto" className="form-label text-start w-100">
            Foto
          </label>
          <input
            type="file"
            className="form-control"
            id="foto"
            onChange={(e) =>
              setUser({
                ...user,
                foto: e.target.files[0],
              })
            }
            name="foto"
          />
        </div>
        <button className="w-100 btn btn-dark">Register</button>
      </form>
      <button
        className="w-100 btn btn-danger mt-3"
        onClick={() => googleLogin()}
      >
        Register with Google 🚀
      </button>
    </div>
  );
};
