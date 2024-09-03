import React from "react";
import { Link } from "react-router-dom";

export const Login = () => {
    return (
        <div className="container rounded border p-3">
            <h2 className="text-center">Login</h2>
            <form action="">
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">Email</label>
                    <input type="text" className="form-control" id="firstName" />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Password</label>
                    <input type="text" className="form-control" id="lastName" />
                </div>
                <div className="d-flex justify-content-between">
                    <Link to="/recover">
                        <p>Forgot Password</p>
                    </Link>
                    <Link to="/Register">
                        <p>Register</p>
                    </Link>
                </div>
                <button className="col-12 btn btn-success">Login</button>
            </form>
        </div>
    )
}