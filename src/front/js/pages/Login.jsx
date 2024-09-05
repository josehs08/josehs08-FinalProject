import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"

export const Login = () => {

    const { actions } = useContext(Context)

    const initialState = {
        email: "",
        password: ""
    }

    const [user, setUser] = useState(initialState)

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const response = await actions.login(user)
            if (response == true) {
                alert('Logged in successfully!')
            }
        } catch (error) {
            console.log("An error ocurred during login:", error.message)
        }
    }

    return (
        <div className="container rounded border p-3">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">Email</label>
                    <input type="text" className="form-control" id="firstName" onChange={handleChange} name="email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Password</label>
                    <input type="text" className="form-control" id="lastName" onChange={handleChange} name='password' />
                </div>
                <button className="col-12 btn btn-success">Login</button>
            </form>
            <div className="d-flex justify-content-between">
                <Link to="/">
                    <p>Forgot Password</p>
                </Link>
                <Link to="/Register">
                    <p>Register</p>
                </Link>
            </div>
        </div >
    )
}