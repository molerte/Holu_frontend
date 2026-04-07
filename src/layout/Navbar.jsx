import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <div className="nav-wrapper">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded-4 px-4 py-2">
            <div className="container-fluid">
            <Link className="navbar-brand mx-auto" to="/">Home</Link>
            <Link className="navbar-brand mx-auto" to="/login">Login</Link>
            </div>
        </nav>
        </div>
    );

}