import { render, screen, fireEvent } from '@testing-library/react';
import TextForm from './TextForm';

beforeEach(() => {
    fetch.resetMocks();
});

test('skickar formulärdata och anropar addDocument', async () => {
    const mockAddDocument = jest.fn(); // Mock-funktion för addDocument
    const mockResponse = { insertedId: '12345' }; // Mockat svar från servern

    fetch.mockResponseOnce(JSON.stringify(mockResponse)); // Mocka fetch-responsen

    render(
        <TextForm username="testuser" addDocument={mockAddDocument} />
    );

    // Fyll i formuläret
    fireEvent.change(screen.getByLabelText(/titel/i), {
        target: { value: 'Testtitel' },
    });
    fireEvent.change(screen.getByLabelText(/innehåll/i), {
        target: { value: 'Testinnehåll' },
    });
    fireEvent.change(screen.getByLabelText(/access \(e-post\)/i), {
        target: { value: 'test@example.com' },
    });

    // Skicka formuläret
    fireEvent.click(screen.getByText(/spara/i));

    // Vänta tills fetch-anropet är klart
    await screen.findByText(/spara/i);

    // Kontrollera att fetch-anropet skedde med rätt data
    expect(fetch).toHaveBeenCalledWith('http://localhost:5000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Testtitel',
            content: 'Testinnehåll',
            username: 'testuser',
            email: 'test@example.com',
        }),
    });

    // Kontrollera att addDocument anropades med rätt data
    expect(mockAddDocument).toHaveBeenCalledWith({
        id: '12345',
        title: 'Testtitel',
        content: 'Testinnehåll',
        username: 'testuser',
        email: 'test@example.com',
    });

});
