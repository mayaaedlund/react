import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DocumentView from './DocumentView';

beforeEach(() => {
    fetch.resetMocks();
});

test('visar laddningsindikator medan dokumentet laddas', async () => {
    fetch.mockResponseOnce(JSON.stringify({}));

    render(
        <MemoryRouter initialEntries={['/documents/1']}>
            <DocumentView />
        </MemoryRouter>
    );

    expect(screen.getByText(/laddar dokument.../i)).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.queryByText(/laddar dokument.../i)).not.toBeInTheDocument();
    });
});

test('visar dokumentinformation när den är hämtad', async () => {
    const mockDocument = {
        _id: '1',
        title: 'Testtitel',
        content: 'Testinnehåll',
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

test('visar felmeddelande om dokumentet inte kan hämtas', async () => {
    fetch.mockRejectOnce(new Error('Dokumentet kunde inte hämtas')); 

    render(
        <MemoryRouter initialEntries={['/documents/1']}>
            <DocumentView />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText(/fel: dokumentet kunde inte hämtas/i)).toBeInTheDocument();
    });
});
