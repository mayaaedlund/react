// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='homepage'>
      <h1>Välkommen </h1>
      <p>Påbörja ditt text-äventyr nu</p>
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
