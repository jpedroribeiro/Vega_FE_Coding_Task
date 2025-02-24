import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LoadingSpinner from '../loading_spinner';
import HomeComponent from '~/routes/components/home';
import DashboardComponent from '~/routes/components/dashboard';

describe('Dashboard tests', () => {
    it('renders the LoadingSpinner component', () => {
        render(<LoadingSpinner />);
        screen.debug();
    });

    it('renders the Home component', () => {
        const router = createMemoryRouter([
            { path: '/', element: <HomeComponent /> } // ✅ Define the route for the test
        ], {
            initialEntries: ['/'], // ✅ Start at the home page
        });

        render(<RouterProvider router={router} />); // ✅ Provide the router context
        screen.debug(); // See rendered output in test logs
    });

    it('renders the Dashboard component', () => {
        const router = createMemoryRouter([
            { path: '/', element: <DashboardComponent /> } // ✅ Define the route for the test
        ], {
            initialEntries: ['/'], // ✅ Start at the home page
        });

        render(<RouterProvider router={router} />); // ✅ Provide the router context
        screen.debug(); // See rendered output in test logs
    });


});