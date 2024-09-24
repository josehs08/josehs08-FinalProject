import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const Settings = () => {
    const { store } = useContext(Context)
    if (store.user) {
        return (
            <div className="d-flex m-5 ">
                <div className="container p-3 border roudned bg-white">

                    <h1>Settings</h1>

                    <div className="card shadow-sm mt-4">
                        <div className="card-body">
                            <h3 className="mb-2">Dark Mode</h3>
                            <label className="form-check-label" htmlFor="dark-mode-switch">
                                Dark Mode:
                            </label>
                            <div className="form-check mb-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                />
                                <label className="form-check-label" htmlFor="dark-mode-switch"></label>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-4">
                        <div className="card-body">
                            <h3 className="mb-2">Notifications</h3>
                            <p>Enable/Disable Notifications</p>
                            <div className="mb-3">
                                <label>Email Frequency:</label>
                                <select>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <h3 className="mb-2">Reminders</h3>
                            <p>Select a reminder time:</p>
                            <label>Reminder Time:</label>
                            <input type="number" placeholder="Hour (0-12)" />
                            <input type="string" value="" placeholder="AM/PM" />
                            <br />
                            <button className="btn btn-dark">Save</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    else {
        return <Navigate to="/" />;
    }
}