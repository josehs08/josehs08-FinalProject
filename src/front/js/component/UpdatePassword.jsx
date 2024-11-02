import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useSearchParams } from "react-router-dom";

export const UpdatePassword = () => {
  const { actions } = useContext(Context);
  const [newPass, setNewPass] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [searchParams] = useSearchParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await actions.updatePassword(
      searchParams.get("token"),
      newPass
    );

    if (response) {
      setStatusMessage("Your password has been updated successfully.");
    } else {
      setStatusMessage(
        "There was an error updating your password. Please try again."
      );
    }
  };

  return (
    <div className="container my-5 border rounded shadow">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className="text-center mb-4">Update Password</h2>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    New Password:
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    className="form-control"
                    id="newPassword"
                    name="password"
                    value={newPass}
                    onChange={(event) => setNewPass(event.target.value)}
                  />
                </div>
                <button className="btn btn-primary w-100 mb-3" type="submit">
                  Update Password
                </button>
              </form>
              {statusMessage && (
                <div className="alert alert-info text-center" role="alert">
                  {statusMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
