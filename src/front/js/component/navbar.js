import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="mb-0">HabiQuest</span>
				</Link>
				<Link to="/profile">
					<span className="mb-0">Profile</span>
				</Link>
				<Link to="/habit">
					<span className="mb-0">Habit</span>
				</Link>

			</div>
		</nav>
	);
};
