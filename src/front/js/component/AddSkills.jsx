import React, { useContext, useState } from "react";
import { Context } from "../store/appContext.js"

export const AddSkills = () => {

    const { store, actions } = useContext(Context);
    const [newSkill, setNewSkill] = useState();

    const handleChange = (e) => {
        setNewSkill({
            ...newSkill,
            [e.target.name]: e.target.value
        })
    }


    const handleSubmit = e => {
        e.preventDefault();
        actions.addSkills(newSkill);
    }


    return (
        <div className="container p-3 w-100 mx-auto">
            <h1 className=" mb-4">Add Skills</h1>
            <form onSubmit={handleSubmit} className="border rounded p-3">
                <div className="mb-2">
                    <label htmlFor="skills" className="form-label">Skills:</label>
                    <input type="text" name="name" onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-2">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea name="description" id="desc" onChange={handleChange} className="form-control"></textarea>
                </div>
                <button type="submit" className="btn btn-dark mb-4 mt-3">Add Skill</button>
            </form>
        </div>

    )
}