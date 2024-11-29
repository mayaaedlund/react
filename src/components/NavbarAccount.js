// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Hem</Link>
        </li>
        <li>
          <Link to="/login">Logga in</Link>
        </li>
        <li>
          <Link to="/editor">Textredigerare</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
