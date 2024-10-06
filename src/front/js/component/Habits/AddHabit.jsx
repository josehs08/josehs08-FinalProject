import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";

export const AddHabit = () => {
  const { actions, store } = useContext(Context);

  const initialState = {
    name: "",
    description: "",
    user_id: store.user.id,
  };
  const [habit, setHabit] = useState(initialState);

  const handleChange = (e) => {
    setHabit({
      ...habit,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      const response = await actions.addHabit(habit);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container border rounded p-3">
      <h2 className="text-start">Add New Habit</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            <strong>Name</strong>
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            onChange={handleChange}
            value={habit.name}
            name="name"
            placeholder="Drink water"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            <strong>Description</strong>
          </label>
          <textarea
            type="text"
            id="description"
            className="form-control"
            onChange={handleChange}
            value={habit.description}
            name="description"
            placeholder="I want to drink water everyday"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="frecuency">
            <strong>Frecuency</strong>
          </label>
          <select
            className="form-select"
            aria-label="Frecuency"
            name="frecunecy"
            id="frecuency"
          >
            <option value="1">Daily</option>
            <option value="2">Weekly</option>
            <option value="3">Montly</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-dark w-100"
          onClick={() => {
            handleSubmit();
          }}
        >
          Add Habit
        </button>
      </form>
    </div>
  );
};
