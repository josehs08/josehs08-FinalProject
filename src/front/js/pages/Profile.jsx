import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { ShowSkills } from "../component/Skills/ShowSkills.jsx";
import { Navigate } from "react-router-dom";

export const Profile = () => {
  const { actions, store } = useContext(Context);
  if (!store.user) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    actions.showHabit(store.user.id);
    actions.getSkills(store.user.id);
    actions.getCompletedHabits(store.user.id);
  }, []);

  return (
    <div className="d-flex justify-content-center m-5">
      <div className="container p-4 border rounded bg-light shadow-sm">
        <div className="d-flex align-items-center mb-4">
          <img
            src={store.user.foto}
            alt="Profile photo"
            className="img-thumbnail rounded-circle col-5 shadow"
            style={{ width: "300px", height: "300px", objectFit: "cover" }}
          />
          <div className="ms-3">
            <h1 className="h3">
              {store.user.first_name} {store.user.last_name}
            </h1>
            <p className="text-muted">
              Joined: {new Date(store.user.created).toLocaleDateString()}
            </p>
          </div>
        </div>

        <ShowSkills />
      </div>
    </div>
  );
};
