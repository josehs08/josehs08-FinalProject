import React, { useContext } from "react";
import { LogOrRegister } from "../component/LoginAndRegister/LogOrRegister.jsx";
import { Context } from "../store/appContext.js";

export const Home = () => {
  const { store } = useContext(Context);

  return (
    <div className="text-center mt-5 p-5">
      <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-md-6 p-5">
            <h1 className="display-1 mb-4">HabiQuest</h1>
            <p className="lead">
              Trransform your daily routines into an epic adventure. With
              HabiQuest, every habit you accomplish earns you points and levels
              up your skills.
            </p>
          </div>
          {!store.user ? (
            <div className="col-md-6 p-5">
              <LogOrRegister />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
