import React, { useState, useContext } from "react";
import { Context } from "../../store/appContext";
import { gapi } from "gapi-script";

export const AddHabit = () => {
  const { actions, store } = useContext(Context);

  const initialState = {
    name: "",
    description: "",
    user_id: store.user.id,
    skill_id: null,
    frequency: "daily",
    time: "08:00",
  };
  const [habit, setHabit] = useState(initialState);
  const skills = store.skills || [];

  const handleChange = (e) => {
    setHabit({
      ...habit,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveHabit = async (e) => {
    e.preventDefault();
    try {
      console.log(habit);
      const response = await actions.addHabit(habit);
      if (response) {
        alert("Habit saved successfully");
      }
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  };

  const handleAddToCalendar = async (e) => {
    e.preventDefault();
    const [hours, minutes] = habit.time.split(":");
    const start = new Date();
    start.setHours(hours, minutes);

    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const gapi = window.gapi;
    const event = {
      summary: habit.name,
      description: habit.description,
      start: {
        dateTime: start.toISOString(),
        timeZone: "America/New_York",
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: "America/New_York",
      },
      recurrence: [`RRULE:FREQ=${habit.frequency.toUpperCase()}`], // Set frequency
    };

    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: process.env.GOOGLE_API_KEY,
          clientId: process.env.GOOGLE_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: "https://www.googleapis.com/auth/calendar.events",
        })
        .then(() => gapi.auth2.getAuthInstance().signIn())
        .then(() => {
          gapi.client.calendar.events
            .insert({
              calendarId: "primary",
              resource: event,
            })
            .then((response) => {
              alert(
                "Event created in Google Calendar: " + response.result.htmlLink
              );
            })
            .catch((error) => {
              console.error("Error creating event: ", error);
              alert("Failed to create event in Google Calendar.");
            });
        })
        .catch((error) => {
          console.error("Error during authentication: ", error);
          alert("Failed to authenticate with Google.");
        });
    });
  };

  return (
    <div className="container border rounded shadow p-3">
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
            id="description"
            className="form-control"
            onChange={handleChange}
            value={habit.description}
            name="description"
            placeholder="I want to drink water everyday"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="frequency" className="form-label">
            <strong>Frequency</strong>
          </label>
          <select
            className="form-select"
            name="frequency"
            id="frequency"
            onChange={handleChange}
            value={habit.frequency}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="time" className="form-label">
            <strong>Time</strong>
          </label>
          <input
            type="time"
            id="time"
            className="form-control"
            onChange={handleChange}
            value={habit.time}
            name="time"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="skill_id" className="form-label">
            <strong>Skill</strong>
          </label>
          <select
            className="form-select"
            aria-label="Skill"
            name="skill_id"
            id="skill_id"
            onChange={handleChange}
            value={habit.skill_id}
          >
            <option value="" disabled>
              Select a skill
            </option>
            <option value="0">None</option>
            {skills?.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="btn btn-dark w-100"
          onClick={handleSaveHabit}
        >
          Save Habit
        </button>

        <button
          type="button"
          className="btn btn-dark w-100 mt-3"
          onClick={handleAddToCalendar}
        >
          Add to Calendar
        </button>
      </form>
    </div>
  );
};
