import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext"

export const Register = () => {

    const { actions } = useContext(Context);

    const initialState = {
        first_name: "",
        last_name: "",
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

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("first_name", user.first_name)
        formData.append("last_name", user.last_name)
        formData.append("email", user.email)
        formData.append("password", user.password)
        const response = actions.register(formData)
        response.then((res) => {
            if (res == 201) {
                alert("User created")
                setUser(initialState)
            } else {
                alert("User not created")
            }
        })
    }

    return (
        <div className="container rounded border p-3">
            <h2 className="text-center">Register</h2>
            <form action="" onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" onChange={handleChange} value={user.firstName} name="first_name" />
                </div>

                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" onChange={handleChange} value={user.lastName} name="last_name" />
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className="form-control" id="email" onChange={handleChange} value={user.email} name="email" />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="text" className="form-control" id="password" onChange={handleChange} value={user.password} name="password" />
                </div>

                <Link to="/login">
                    <p className="text-end">Login</p>
                </Link>
                <button className="col-12 btn btn-success">Register</button>
            </form>
        </div>
    )
}