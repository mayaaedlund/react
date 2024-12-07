import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DocumentList from './DocumentList';

test('visar en lista över användarens dokument', () => {
    const mockDocuments = [
        {
            _id: '1',
            title: 'Dokument 1',
            owner: 'testuser',
            access: 'medredigerare1',
        },
        {
            _id: '2',
            title: 'Dokument 2',
            owner: 'testuser',
            access: 'medredigerare2',
        },
        {
            _id: '3',
            title: 'Dokument 3',
            owner: 'annanuser',
            access: 'testuser',
        },
    ];

    render(
        <MemoryRouter>
            <DocumentList documents={mockDocuments} username="testuser" />
        </MemoryRouter>
    );

    // Kontrollera att dokument där användaren är ägare eller medredigerare visas
    expect(screen.getByText(/dokument 1/i)).toBeInTheDocument();
    expect(screen.getByText(/dokument 2/i)).toBeInTheDocument();
    expect(screen.getByText(/dokument 3/i)).toBeInTheDocument();
});
