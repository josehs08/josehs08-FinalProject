import React, { useState } from "react";

export const AddToCalendarForm = ({ onAdd }) => {
  const [time, setTime] = useState("08:00");
  const [frequency, setFrequency] = useState("DAILY");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(time, frequency);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>
      <label>
        Frequency:
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="DAILY">Daily</option>
          <option value="WEEKLY">Weekly</option>
          <option value="MONTHLY">Monthly</option>
        </select>
      </label>
      <button type="submit">Add to Calendar</button>
    </form>
  );
};
