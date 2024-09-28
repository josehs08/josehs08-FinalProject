import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const EditHabit = ({ habit }) => {
  const { actions, store } = useContext(Context);
  const [newHabit, setNewHabit] = useState(habit);

  const handleChange = (e) => {
    setNewHabit({
      ...newHabit,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await actions.updateHabit(newHabit.id, newHabit);
      if (response) {
        alert("Habit modified succesfuly");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className="border p-3 rounded" onSubmit={handleSubmit}>
        <h2>Edit Habit</h2>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            className="form-control"
            id="name"
            type="text"
            value={newHabit.name}
            onChange={handleChange}
            name="name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <input
            className="form-control"
            type="text"
            id="description"
            value={newHabit.description}
            onChange={handleChange}
            name="description"
          />
        </div>

        <button className="btn btn-dark">Submit</button>
      </form>
    </>
  );
};
