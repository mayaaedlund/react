import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    sessionStorage.clear();

    try {
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, api_key: "6fd8e90cd1ad3e58e1e91e5de1290329" }), // Lägg till api_key här
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (response.ok) {
            // Spara token i sessionStorage och uppdatera state
            sessionStorage.setItem('token', data.data.token);
            sessionStorage.setItem('username', data.data.email);
            setToken(data.data.token);
            console.log(data.data.token);
            console.log(data.data.email);

            // Ge användaren feedback och navigera
            setMessage("Inloggningen lyckades!");
            navigate('/editor');
        } else {
            // Hantera felmeddelanden från API
            setMessage(data.message || 'Inloggning misslyckades.');
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('Ett fel uppstod. Försök igen.');
    }
};


  return (
    <div>
      <h1>Logga in</h1>
      <form onSubmit={handleSubmit}>
        <label>
          E-post:
          <input
            type="email"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Logga in</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
