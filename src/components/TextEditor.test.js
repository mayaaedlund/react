import TextEditor from './TextEditor';
import { render, screen } from '@testing-library/react';

beforeEach(() => {
    global.fetch = jest.fn();
});

afterEach(() => {
    jest.resetAllMocks();
});

test('renders Titel label', () => {
    render(<TextEditor />);
    const labelElement = screen.getByText("Titel");
    expect(labelElement).toBeInTheDocument();
});

