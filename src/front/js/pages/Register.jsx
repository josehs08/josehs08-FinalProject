import React from "react";
import { Link } from "react-router-dom";

export const Register = () => {
    return (
        <div className="container rounded border p-3">
            <h2>Register</h2>
            <form action="">
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className="form-control" id="email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="text" className="form-control" id="password" />
                </div>
                <Link to="/login">
                    <p className="text-end">Login</p>
                </Link>
                <button className="col-12 btn btn-success">Register</button>
            </form>
        </div>
    )
}