import React, { useContext, useEffect } from "react";
import { Context } from "../../store/appContext.js";
import { EditHabit } from "./EditHabit.jsx";
import { AddHabit } from "./AddHabit.jsx";

export const ShowHabits = () => {
  const { actions, store } = useContext(Context);

  const handleDelete = async (currentHabit) => {
    try {
      const response = await actions.changeHabitDeleted(currentHabit.id);

      if (response) {
        alert("Habit deleted!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getActiveHabits = () => store.habit.filter((habit) => !habit.deleted);

  return (
    <div className="container p-3 border rounded bg-white shadow">
      <h2>Habit List</h2>
      {getActiveHabits().length === 0 ? (
        <p>No habits found!</p>
      ) : (
        <ul className="list-group">
          {getActiveHabits().map((habit) => (
            <li key={habit.id} className="list-group-item shadow-sm">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={
                      store.completedHabits?.find(
                        (uh) => uh.habit_id === habit.id
                      )?.completed
                    }
                    onChange={() =>
                      actions.completeHabit(habit.id, store.user.id)
                    }
                  />
                  <div>
                    <p className="mb-0">
                      <strong>{habit.name}</strong>
                    </p>
                    <small className="text-muted">{habit.description}</small>
                    <br />
                    <small className="text-muted">
                      Created on:{habit.date}
                    </small>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleDelete(habit)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target={`#modalEdit-${habit.id}`}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div
                className="modal fade"
                id={`modalEdit-${habit.id}`}
                tabIndex="-1"
                aria-labelledby={`modalEdit-${habit.id}`}
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <EditHabit habit={habit} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="btn btn-success mt-3 w-100"
        data-bs-toggle="modal"
        data-bs-target="#modalAdd"
      >
        Add Habits
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
            <AddHabit />
          </div>
        </div>
      </div>
    </div>
  );
};
