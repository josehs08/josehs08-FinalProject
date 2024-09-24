import React, { useContext } from "react";
import { LogOrRegister } from "../component/LogOrRegister.jsx";
import { Context } from "../store/appContext.js";


export const Home = () => {
	const { store } = useContext(Context);

	return (
		<div className="text-center mt-5 d-flex p-5 mx-auto">
			<div className="col-6 p-5 mx-auto">
				<h1 className="display-1">HabiQuest</h1>
				<p>Turn your daily routines into an exciting adventure. With HabitQuest, every habit you complete earns you points and levels up your skills.</p>
			</div>
			{
				!store.user ?
					<div className="col-6 mx-auto">
						<LogOrRegister />
					</div> : null
			}
		</div>
	);
};
