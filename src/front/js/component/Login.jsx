import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js"


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
        <div className="container p-3">
            <h2 className="text-start">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="mail" className="form-label text-start w-100">Email</label>
                    <input type="email" className="form-control" id="mail" onChange={handleChange} name="email" placeholder="m@example.com" />
                </div>
                <div className="mb-3">
                    <label htmlFor="pass" className="form-label text-start w-100">Password</label>
                    <input type="password" className="form-control" id="pass" onChange={handleChange} name='password' />
                </div>
                <button className="w-100 btn btn-dark">Login</button>
            </form>
        </div >
    )
}