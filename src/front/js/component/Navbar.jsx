import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";
import { Context } from "../store/appContext";
import {
  FaUser,
  FaList,
  FaCog,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaLightbulb,
} from "react-icons/fa";

export const Navbar = () => {
  const { actions, store } = useContext(Context);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fs-3 font-weight-bold">
          HabiQuest
        </Link>
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
          className="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent"
        >
          {store.user ? (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <FaUser /> Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/habit" className="nav-link">
                  <FaList /> Habit
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/skills" className="nav-link">
                  <FaLightbulb /> Skills
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link">
                  <FaCog /> Settings
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-link clickable" onClick={actions.logout}>
                  <FaSignOutAlt /> Logout
                </span>
              </li>
            </ul>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
};
