import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";

export const ShowHabits = () => {

    const { actions, store } = useContext(Context)

    const [habitList, setHabitList] = useState([])
    useEffect(() => {
        actions.showHabit(store.user_id)
        setHabitList(store.habit)
    }, [store])

    return (
        <div className="container mt-5 p-3 border border-danger">
            {
                habitList.length <= 0 ? <p>Cargando datos...</p> :
                    habitList.map((habit) => {
                        return <p>{habit.name}</p>
                    })
            }
        </div>
    )
} 