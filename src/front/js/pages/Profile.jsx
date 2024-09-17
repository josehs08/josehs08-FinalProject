import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { ShowHabits } from "../component/ShowHabits.jsx";
import { AddHabit } from "../component/AddHabit.jsx";

export const Profile = () => {


    const { actions, store } = useContext(Context)

    const [user, setUser] = useState(store.user)

    useEffect(() => {



    }, [])


    return (
        <div className="p-5">
            <div className="d-flex justify-content-between">
                <div className="gap-2 d-flex">
                    <img src="https://picsum.photos/200" alt="" />
                    <h1>{user.first_name} {user.last_name}</h1>
                </div>
                <div className="border rounded">
                    <h1>Skills</h1>
                </div>
            </div>
            <div className="d-flex justify-content-between gap-1">
                <div className="border rounded col-3 mt-3">
                    <ShowHabits />


                    <button type="button" className="btn btn-dark w-75 d-flex my-3 mx-auto" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Habits
                    </button>

                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <AddHabit />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border rounded col-3 ">
                    <h1>Challenges</h1>
                </div>
                <div className="border rounded col-3 ">
                    <h1>Settings</h1>
                </div>
            </div>
        </div>
    )
}