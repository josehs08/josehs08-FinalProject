import React, { useContext } from "react";
import { LogOrRegister } from "../component/LogOrRegister.jsx";

export const Home = () => {

	return (
		<div className="text-center mt-5 d-flex p-5">
			<div className="col-6 p-5">
				<h1 className="display-1">HabiQuest</h1>
				<p>Turn your daily routines into an exciting adventure. With HabitQuest, every habit you complete earns you points and levels up your skills.</p>
			</div>
			<div className="col-6">
				<LogOrRegister />
			</div>

		</div>
	);
};
