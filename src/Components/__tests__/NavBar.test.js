import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../NavBar';

test('renders NavBar component', () => {
    render(<NavBar />);
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
});