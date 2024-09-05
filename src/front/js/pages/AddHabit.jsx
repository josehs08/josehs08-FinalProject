import React, { useState, useContext } from "react";
import { Context } from "../store/appContext"

export const AddHabit = () => {

    const { actions, store } = useContext(Context)

    const initialState = {
        name: "",
        description: "",
        user_id: store.user.id
    }
    const [habit, setHabit] = useState(initialState)

    const handleChange = (e) => {
        setHabit({
            ...habit,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            const response = await actions.addHabit(habit)
            if (response) {
                alert('Task created succesfully!')
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="container border border-danger p-3">
            <h2 className="text-center">Add Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input type="text" id="name" className="form-control" onChange={handleChange} value={habit.name} name="name" />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripcion</label>
                    <input type="text" id="description" className="form-control" onChange={handleChange} value={habit.description} name="description" />
                </div>

                <button className="btn btn-success">Agregar</button>

            </form>
        </div>
    )
}