import React, { useEffect, useReducer } from "react";
import axios from "axios";


const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
}

const UPDATE_FORM = "UPDATE_FORM";
const SUBMIT = "SUBMIT";

const reducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM:
            return { ...state, [action.key]: action.value }
        case SUBMIT:
            action.event.preventDefault();
            axios.post('http://localhost:5000/api/user', state)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            return initialForm;
        default:
            return state
    }
}

const FormMain = ({ data }) => {
    const [state, dispatch] = useReducer(reducer, initialForm);
    return (
        <>
            <form onSubmit={
                (e) =>
                    dispatch({
                        type: SUBMIT, event: e, func: data
                    })}>
                <div className="mb-3 row">
                    <div className="col-md-6">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="first_name" value={state.firstName} onChange={(e) => dispatch({ type: UPDATE_FORM, key: "firstName", value: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input type="text" className="form-control " id="last_name" value={state.lastName} onChange={(e) => dispatch({ type: UPDATE_FORM, key: "lastName", value: e.target.value })} />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" value={state.email} onChange={(e) => dispatch({ type: UPDATE_FORM, key: "email", value: e.target.value })} />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={state.password} onChange={(e) => dispatch({ type: UPDATE_FORM, key: "password", value: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
}

export default FormMain; 