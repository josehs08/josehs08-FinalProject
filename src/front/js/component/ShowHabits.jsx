import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { EditHabit } from "./EditHabit.jsx";

export const ShowHabits = () => {

    const { actions, store } = useContext(Context)
    const [habitList, setHabitList] = useState(store.habit)

    // useEffect(() => {
    //     actions.showHabit(store.user.id)
    //     setHabitList(store.habit)
    // }, [])

    const handleDelete = async (currentHabit) => {
        try {
            const response = await actions.updateHabit(currentHabit.id, {
                ...currentHabit,
                deleted: !currentHabit.deleted
            })
            if (response) {

                setHabitList(habitList.filter((value) => {
                    return value != currentHabit
                }))
                alert("Habit deleted!")
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="container p-3 border rounded bg-white">
            <h2>Habit list</h2>
            {
                habitList.length <= 0 ? (
                    <p>Cargando datos...</p>
                ) : (
                    habitList.filter((habit) => !habit.deleted).map((habit, index) => (
                        <li key={index} className="list-group-item">
                            <div className="form-check-label d-flex justify-content-between">
                                <div className="d-flex gap-3">
                                    <input type="checkbox" className="form-check-input" />
                                    <p><strong>{habit.name}</strong></p>
                                </div>
                                <div className="gap-1 d-flex">
                                    <button onClick={() => handleDelete(habit)} className="btn btn-dark">Borrar</button>
                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#modalEdit-${habit.id}`}
                                    >
                                        Edit Habits
                                    </button>
                                </div>
                            </div>

                            {/* <div className="modal fade" id={`modalEdit-${habit.id}`} tabindex="-1" aria-labelledby={`modalEdit-${habit.id}`} aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <EditHabit habit={habit} />
                                    </div>
                                </div>
                            </div> */}
                            <EditHabit habit={habit} />
                        </li>
                    ))
                )
            }
        </div>
    )
} 