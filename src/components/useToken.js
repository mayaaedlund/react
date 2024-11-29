import { useState } from 'react';

function useToken() {
  const getToken = () => {
    return sessionStorage.getItem('token'); // Hämtar token från sessionStorage
  };

  const [token, setTokenState] = useState(getToken());

  const setToken = (userToken) => {
    sessionStorage.setItem('token', userToken); // Sparar token i sessionStorage
    setTokenState(userToken); // Uppdaterar state
  };

  return { token, setToken };
}

export default useToken;
