import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

export const Profile = () => {


    const { actions, store } = useContext(Context)

    const [user, setUser] = useState(store.user)

    useEffect(() => {



    }, [])


    return (
        <div className="p-3">
            <div className="d-flex justify-content-between">
                <img src="https://picsum.photos/200" alt="" />
                <h1>Nombre: {user.first_name} {user.last_name}</h1>
                <div className="border rounded">
                    <h1>Skills</h1>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <div className="border rounded">
                    <h1>Habits</h1>
                </div>
                <div className="border rounded">
                    <h1>Challenges</h1>
                </div>
                <div className="border rounded">
                    <h1>Settings</h1>
                </div>
            </div>
        </div>
    )
}