import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home.jsx";
import injectContext from "./store/appContext";

import { Navbar } from "./component/Navbar.jsx";

import { Register } from "./component/LoginAndRegister/Register.jsx";
import { Login } from "./component/LoginAndRegister/Login.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Habit } from "./pages/Habit.jsx";
import { Skills } from "./pages/Skills.jsx";
import { Settings } from "./pages/Settings.jsx";
import { ResetPass } from "./component/ResetPass.jsx";
import { UpdatePassword } from "./component/UpdatePassword.jsx";

import { GoogleOAuthProvider } from "@react-oauth/google"

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <GoogleOAuthProvider clientId='379339280263-lm3cd590elibacpt1k04ihcjoq94ok8i.apps.googleusercontent.com'>
                <BrowserRouter basename={basename}>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Habit />} path="/habit" />
                        <Route element={<Skills />} path="/skills" />
                        <Route element={<Settings />} path="/settings" />
                        <Route element={<ResetPass />} path="/recovery-password" />
                        <Route element={< UpdatePassword />} path="password-update" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                </BrowserRouter>
            </GoogleOAuthProvider>
        </div>
    );
};

export default injectContext(Layout);
