import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Pokedex" activeClassName="active">Pokedex</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/GameData" activeClassName="active">Game Data</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Tools" activeClassName="active">Useful Tools</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Forum" activeClassName="active">Forum</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/Signup" activeClassName="active">Create Account</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;