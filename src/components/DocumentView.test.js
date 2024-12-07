import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import DocumentView from './DocumentView';

// Mocka fetch och sessionStorage
beforeEach(() => {
    fetch.resetMocks();
    sessionStorage.clear();
});

test('visar dokumentinformation när den är hämtad', async () => {
    const mockDocument = {
        _id: '1',
        title: 'Testtitel',
        content: 'Testinnehåll',
        comments: [],
        access: 'testUser@example.com'
    };
    fetch.mockResponseOnce(JSON.stringify(mockDocument));

    render(
        <MemoryRouter initialEntries={['/documents/1']}>
            <DocumentView />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByDisplayValue(/testtitel/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/testinnehåll/i)).toBeInTheDocument();
    });
});

