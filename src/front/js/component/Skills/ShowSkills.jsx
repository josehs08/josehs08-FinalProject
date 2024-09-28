import React, { useContext } from "react";
import { Context } from "../store/appContext.js";
import { AddSkills } from "./AddSkills.jsx";

export const ShowSkills = () => {
  const { store, actions } = useContext(Context);
  const handleDelete = (id) => {
    actions.deleteSkills(id);
  };

  return (
    <div className="container p-3 border roudned bg-white shadow">
      <h1>Skills</h1>
      {store?.skills?.map((skill, index) => (
        <div className="mb-3 border rounded p-3 shadow" key={index}>
          <h2>{skill.name}</h2>
          <p>
            <b>Description:</b> {skill.description}
          </p>
          <p>
            <b>Level:</b> {skill.level}
          </p>
          <p>
            <b>Progress:</b> {skill.progress}
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-label="Basic example"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="progress-bar bg-dark"
              style={{ width: "10%" }}
            ></div>
          </div>
          <button
            onClick={() => handleDelete(skill.id)}
            type="submit"
            className="btn btn-dark w-100 mt-3"
          >
            Delete
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-dark mt-3 w-100"
        data-bs-toggle="modal"
        data-bs-target={`#modalAdd`}
      >
        Add Skill
      </button>
      <div
        className="modal fade"
        id={`modalAdd`}
        tabindex="-1"
        aria-labelledby={`modalAdd`}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <AddSkills />
          </div>
        </div>
      </div>
    </div>
  );
};
