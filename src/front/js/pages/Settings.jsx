import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";

export const Settings = () => {
  const { actions, store } = useContext(Context);
  const [user, setUser] = useState({ ...store.user });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await actions.updateUser(user);
      if (response) {
        alert("Profile updated successfully");
      } else {
        alert("Error updating profile");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!store.user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5 rounded border shadow p-3">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            name="first_name"
            value={user.first_name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            name="last_name"
            value={user.last_name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
