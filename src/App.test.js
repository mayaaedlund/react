import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
    fetch.resetMocks();
});

test('renders app title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Min app/i);
    expect(titleElement).toBeInTheDocument();
});
