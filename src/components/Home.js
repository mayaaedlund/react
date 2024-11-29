// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Textredigerare</h2>
      <div>
        <Link to="/login">
          <button>Logga in</button>
        </Link>
      </div>
      <div>
        <Link to="/register">
          <button>Skapa konto</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
