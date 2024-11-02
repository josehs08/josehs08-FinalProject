import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

export const ResetPass = () => {
  const { actions } = useContext(Context);

  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = ({ target }) => {
    setEmail(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    const response = await actions.resetPassword(email);
    if (response) {
      setStatusMessage("An email has been sent to reset your password.");
    } else {
      setStatusMessage(
        "There was an error processing your request. Please try again."
      );
    }
  };

  return (
    <div className="container my-5 p-3 border rounded shadow">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className="text-center mb-4">Reset Password</h2>
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="btnEmail" className="form-label">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    className="form-control"
                    id="btnEmail"
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-primary w-100 mb-3" type="submit">
                  Send Reset Email
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
