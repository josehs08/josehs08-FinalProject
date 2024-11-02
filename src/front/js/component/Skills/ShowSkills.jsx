import React, { useContext } from "react";
import { Context } from "../../store/appContext.js";
import { AddSkills } from "./AddSkills.jsx";

export const ShowSkills = () => {
  const { store, actions } = useContext(Context);

  const handleDelete = (id) => {
    actions.deleteSkills(id);
  };

  return (
    <div className="container p-4 border rounded bg-light shadow">
      <h1 className="mb-4">Skills</h1>
      {store?.skills?.length > 0 ? (
        <div className="row">
          {store.skills.map((skill) => (
            <div className="col-md-4 col-sm-6 mb-4" key={skill.id}>
              <div className="p-4 bg-white border rounded shadow-sm h-100">
                <h2 className="h5">{skill.name}</h2>
                <p>
                  <strong>Description:</strong> {skill.description}
                </p>
                <p>
                  <strong>Level:</strong> {skill.level}
                </p>
                <p>
                  <strong>Progress:</strong> {skill.progress}%
                </p>
                <div
                  className="progress mb-3"
                  role="progressbar"
                  aria-valuenow={skill.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${skill.progress}%` }}
                  ></div>
                </div>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="btn btn-danger w-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No skills added yet.</p>
      )}
      <button
        type="button"
        className="btn btn-primary mt-3 w-100"
        data-bs-toggle="modal"
        data-bs-target="#modalAdd"
      >
        Add Skill
      </button>
      <div
        className="modal fade"
        id="modalAdd"
        tabIndex="-1"
        aria-labelledby="modalAdd"
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
