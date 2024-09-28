import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";
import "../../styles/profile.css";

export const Profile = () => {
  const { actions, store } = useContext(Context);
  const [user, setUser] = useState(store.user);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  if (store.user) {
    return (
      <div className="d-flex m-5 gap-3 ">
        <div className="container p-3 border rounded bg-white shadow">
          <div className="d-flex justify-content-between mb-3">
            <div className="gap-2 d-flex col">
              <img src={store.user.foto} alt="" className="col-5 shadow" />
              <div className="col-5">
                <h1>
                  {store.user.first_name} {store.user.last_name}
                </h1>
                <p>Joined: {store.user.created} </p>
              </div>
            </div>
          </div>
          <form onSubmit={actions.updateUser}>
            <div className="mb-3">
              <label className="col-form-label">First Name:</label>
              <input
                type="text"
                className="form-control"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="col-form-label">Last Name:</label>
              <input
                type="text"
                className="form-control"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="col-form-label">Description:</label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={user.description}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-dark">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    );
  }
  return <Navigate to="/" />;
};
