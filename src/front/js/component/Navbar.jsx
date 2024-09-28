import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";

export const Navbar = () => {
  const { actions, store } = useContext(Context);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse d-flex justify-content-between"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                <span className="mb-0 text-white">HabiQuest</span>
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/profile" className="nav-link">
                <span className="mb-0 text-white">Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/habit" className="nav-link">
                <span className="mb-0 text-white">Habit</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/skills" className="nav-link">
                <span className="mb-0 text-white">Skills</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link">
                <span className="mb-0 text-white">Settings</span>
              </Link>
            </li>
            {store.user ? (
              <li className="nav-item">
                <span
                  className="nav-link mb-0 text-white"
                  onClick={actions.logout}
                >
                  Logout
                </span>
              </li>
            ) : (
              <h1>hola</h1>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
