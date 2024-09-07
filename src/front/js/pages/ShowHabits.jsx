import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const ShowHabits = () => {

    const { actions, store } = useContext(Context)
    const [habitList, setHabitList] = useState(store.habit)

    useEffect(() => {
        actions.showHabit(store.user.id)
        setHabitList(store.habit)
    }, [store.habit.length])

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
                habitList.length <= 0 ? <p>Cargando datos...</p> :
                    habitList.map((habit) => {
                        if (!habit.deleted) {
                            return (
                                <li className="list-group-item" key={habit.id}>

                                    <div className="form-check-label d-flex justify-content-between">
                                        <div className="d-flex gap-3">
                                            <input type="checkbox" className="form-check-input" key={habit.id} />
                                            <p><strong>{habit.name}</strong></p>
                                        </div>
                                        <button onClick={() => { handleDelete(habit) }} className="btn btn-dark">Borrar</button>
                                    </div>

                                </li>
                            )
                        }
                    })
            }
        </div>
    )
} 