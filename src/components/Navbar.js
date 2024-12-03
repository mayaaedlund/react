// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/" className="navbar-link">Hem</Link>
        </li>
        <li>
          <Link to="/login" className="navbar-link">Logga in</Link>
        </li>
        <li>
          <Link to="/register" className="navbar-link">Registrera</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
