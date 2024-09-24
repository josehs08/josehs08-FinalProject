import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext.js";
import { EditHabit } from "./EditHabit.jsx";
import { AddHabit } from "./AddHabit.jsx"

export const ShowHabits = () => {

    const { actions, store } = useContext(Context)
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

    const getActiveHabits = () => store.habit.filter((habit) => !habit.deleted);

    return (
        <div className="container p-3 border rounded bg-white shadow">
            <h2>Habit list</h2>
            {
                getActiveHabits().length <= 0 ? (
                    <p>No tienes habitos!</p>
                ) : (
                    store.habit.filter((habit) => !habit.deleted).map((habit, index) => (
                        <li key={index} className="list-group-item shadow">
                            <div className="form-check-label d-flex justify-content-between rounded">
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

                            <div className="modal fade" id={`modalEdit-${habit.id}`} tabindex="-1" aria-labelledby={`modalEdit-${habit.id}`} aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <EditHabit habit={habit} />
                                    </div>
                                </div>
                            </div>

                        </li>
                    ))
                )
            }
            <button
                type="button"
                className="btn btn-dark mt-3 w-100"
                data-bs-toggle="modal"
                data-bs-target={`#modalAdd`}
            >
                Add Habits
            </button>

            <div className="modal fade" id={`modalAdd`} tabindex="-1" aria-labelledby={`modalAdd`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <AddHabit />
                    </div>
                </div>
            </div>

        </div>

    )
} 