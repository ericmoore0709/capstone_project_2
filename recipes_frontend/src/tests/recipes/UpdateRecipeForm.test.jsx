import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import UpdateRecipeForm from "../../components/recipes/UpdateRecipeForm";
import RecipesApi from '../../../api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the API module
vi.mock('../../../api');

describe('UpdateRecipeForm', () => {
    const mockSignedInUser = { id: 1 };
    const mockRecipe = {
        id: 1,
        title: 'Test Recipe',
        description: 'A tasty test recipe',
        image: 'https://via.placeholder.com/150',
        visibility_id: 1
    };

    const renderComponent = (props = {}) => {
        return render(
            <MemoryRouter initialEntries={['/recipes/1/edit']}>
                <Routes>
                    <Route path="/recipes/:id/edit" element={<UpdateRecipeForm signedInUser={mockSignedInUser} {...props} />} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        RecipesApi.getRecipeById.mockResolvedValue(mockRecipe); // Mock API response
    });

    it('renders without crashing', () => {
        renderComponent({ updateRecipe: vi.fn() });
    });

    it('takes a snapshot', async () => {
        const { asFragment } = renderComponent({ updateRecipe: vi.fn() });
        await waitFor(() => expect(screen.getByDisplayValue(mockRecipe.title)).toBeInTheDocument());
        expect(asFragment()).toMatchSnapshot();
    });

    it('fetches and populates form fields with existing recipe data', async () => {
        renderComponent({ updateRecipe: vi.fn() });

        // Wait for the async data to load
        await waitFor(() => {
            expect(screen.getByDisplayValue(mockRecipe.title)).toBeInTheDocument();
            expect(screen.getByDisplayValue(mockRecipe.description)).toBeInTheDocument();
        });
    });

    it('updates form fields correctly on user input', async () => {
        renderComponent({ updateRecipe: vi.fn() });

        await waitFor(() => expect(screen.getByDisplayValue(mockRecipe.title)).toBeInTheDocument());

        const titleInput = screen.getByLabelText(/title/i);
        fireEvent.change(titleInput, { target: { value: 'Updated Recipe Title' } });
        expect(titleInput).toHaveValue('Updated Recipe Title');
    });

    it('calls updateRecipe with sanitized data on form submission', async () => {
        const updateRecipeMock = vi.fn();
        renderComponent({ updateRecipe: updateRecipeMock });

        await waitFor(() => expect(screen.getByDisplayValue(mockRecipe.title)).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Updated Title' } });
        fireEvent.click(screen.getByRole('button', { name: /Update/i }));

        await waitFor(() => {
            expect(updateRecipeMock).toHaveBeenCalledWith({
                id: mockRecipe.id,
                title: 'Updated Title',
                description: mockRecipe.description,
                image: mockRecipe.image,
                visibility_id: Number(mockRecipe.visibility_id),
                author_id: mockSignedInUser.id
            });
        });
    });

    it('displays error messages when there are errors', async () => {
        const errorMessages = ['Title cannot be blank.', 'Description cannot be blank.'];
        renderComponent({ updateRecipe: vi.fn(), errors: errorMessages });

        errorMessages.forEach(error => {
            expect(screen.getByText(error)).toBeInTheDocument();
        });
    });
});
