import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom/extend-expect'; // För att använda matchers som toBeInTheDocument()

jest.mock('./components/PrivateRoute', () => ({
  __esModule: true,
  default: ({ children }) => children, // Mockar PrivateRoute för att bara återge barnen utan autentisering
}));

describe('App', () => {
  test('renderar Home-sidan på root route', () => {
    render(
      <App />
    );
    // Kontrollera att Home-sidan renderas
    expect(screen.getByText(/Välkommen/i)).toBeInTheDocument(); // Justera texten för vad du har på Home-komponenten
  });
});
