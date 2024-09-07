import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Login } from "./Login.jsx";
import { Register } from "./Register.jsx";

export const LogOrRegister = () => {
    const [selector, setSelector] = useState(false)

    const handleChange = () => {
        setSelector(!selector)
    }

    return (
        <div>

            <div className={selector ? "d-none" : "border rounded p-3"} >
                <Login />
                <div className="d-flex justify-content-between mt-3 p-3">
                    <Link to="/" className="text-decoration-none">
                        <p className="text-dark">Forgot Password?</p>
                    </Link>

                    <div className="d-flex gap-1 justify-content-end">
                        <p><small>Don't have an account?</small></p>
                        <a className={selector ? "d-none" : "text-dark text-decoration-none"} onClick={handleChange}><strong>Register</strong></a>
                    </div>
                </div>

            </div>
            <div className={!selector ? "d-none" : "border rounded p-3"} >
                <Register />
                <div className="d-flex gap-1 justify-content-end mt-3 p-3">
                    <p><small>Already have an account?</small></p>
                    <a className={!selector ? "d-none" : "text-dark text-decoration-none"} onClick={handleChange}><strong>Login</strong></a>
                </div>
            </div>
        </div>
    )
}