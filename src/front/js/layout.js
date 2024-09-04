import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home.jsx";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";

import { Register } from "./pages/Register.jsx";
import { Login } from "./pages/Login.jsx";
import { Profile } from "./pages/Profile.jsx";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Register/>} path="/register"/>
                        <Route element={<Login/>} path="/login"/>
                        <Route element={<Profile/>} path="/profile"/>
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>

            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
