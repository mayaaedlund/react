import { render, act } from '@testing-library/react';
import useToken from './useToken';

beforeEach(() => {
    // Rensa sessionStorage innan varje test
    sessionStorage.clear();
});

function TestComponent({ onRender }) {
    const hook = useToken();
    onRender(hook);
    return null;
}

test('returnerar initialt token från sessionStorage', () => {
    sessionStorage.setItem('token', 'initial-token');
    let result;

    render(<TestComponent onRender={(hook) => (result = hook)} />);

    expect(result.token).toBe('initial-token');
});

test('returnerar null om ingen token finns i sessionStorage', () => {
    let result;

    render(<TestComponent onRender={(hook) => (result = hook)} />);

    expect(result.token).toBeNull();
});

test('uppdaterar token i sessionStorage och state', () => {
    let result;

    render(<TestComponent onRender={(hook) => (result = hook)} />);

    act(() => {
        result.setToken('new-token');
    });

    expect(result.token).toBe('new-token');
    expect(sessionStorage.getItem('token')).toBe('new-token');
});
