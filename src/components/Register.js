import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skapa en förfrågan till API:et
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: "6fd8e90cd1ad3e58e1e91e5de1290329", 
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.data.message);
        navigate('/login');
      } else {
        setMessage('Registreringen misslyckades. Försök igen.');
      }
    } catch (error) {
      setMessage('Ett fel inträffade. Försök igen senare.');
    }
  };

  return (
    <div className='homepage'>
      <form onSubmit={handleSubmit}>
        <h1 className='login'>Skapa Konto</h1>
        <label>
          E-post:
          <input
            type="email"
            placeholder="E-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
        Lösenord:
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        </label>
        <br />
        <button type="submit">Skapa konto</button>
        <p>Logga in <Link to={`/login`}>Här</Link></p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
