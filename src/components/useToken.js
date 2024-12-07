// useToken.js
// Denna custom hook hanterar lagring och hämtning av en autentiseringstoken från sessionStorage.
// Hooken används för att hålla token tillgänglig i komponenter och underlätta hantering av användarens inloggningsstatus.
import { useState } from 'react';


function useToken() {
  const getToken = () => {
    // Hämtar den sparade autentiseringstoken från sessionStorage.
    // Om ingen token finns sparad returnerar funktionen `null`.
    return sessionStorage.getItem('token');
  };

  // State som håller nuvarande token. Den initialiseras med värdet från sessionStorage (om en token finns).
  const [token, setTokenState] = useState(getToken());

  const setToken = (userToken) => {
    sessionStorage.setItem('token', userToken); // Sparar token i sessionStorage
    setTokenState(userToken); // Uppdaterar state
  };

  return { token, setToken };
}

export default useToken;
