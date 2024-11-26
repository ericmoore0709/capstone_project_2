import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RecipeDetails from '../../components/recipes/RecipeDetails';
import RecipesApi from '../../../api';
import { describe, expect, it, vi } from 'vitest';

// Mock the API module
vi.mock('../../../api');

describe('RecipeDetails', () => {
    const renderComponent = (id) => {
        return render(
            <MemoryRouter initialEntries={[`/recipe/${id}`]}>
                <Routes>
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('displays a loading spinner initially', () => {
        renderComponent(1);
        expect(screen.getByRole('status')).toBeInTheDocument(); // Status role for Spinner
    });

    it('displays error message on API error', async () => {
        RecipesApi.getRecipeById.mockRejectedValue(new Error('API failure'));

        renderComponent(1);

        await waitFor(() => {
            expect(screen.getByText('Failed to load recipe details.')).toBeInTheDocument();
        });
    });

    it('displays recipe details when data is successfully fetched', async () => {
        const mockRecipe = {
            title: 'Test Recipe',
            description: 'Delicious test recipe description.',
            image: 'https://via.placeholder.com/150'
        };
        RecipesApi.getRecipeById.mockResolvedValue(mockRecipe);

        renderComponent(1);

        await waitFor(() => {
            expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
            expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
            expect(screen.getByAltText(`${mockRecipe.title} image`)).toHaveAttribute('src', mockRecipe.image);
        });
    });

    it('displays "Recipe Not Found" if no recipe is returned', async () => {
        RecipesApi.getRecipeById.mockResolvedValue(null);

        renderComponent(1);

        await waitFor(() => {
            expect(screen.getByText('Recipe Not Found')).toBeInTheDocument();
        });
    });
});
