import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import RecipeList from "../../components/recipes/RecipeList";
import { MemoryRouter } from "react-router-dom";

describe('RecipeList', () => {

    const mockSignedInUser = { id: 1 };

    const renderComponent = (props) => {
        return render(
            <MemoryRouter>
                <RecipeList signedInUser={mockSignedInUser} deleteRecipe={vi.fn()} {...props} />
            </MemoryRouter>
        );
    };

    it('renders without crashing', () => {
        renderComponent({ recipes: [] });
    });

    it('takes a snapshot', () => {
        const { asFragment } = renderComponent({ recipes: [] });
        expect(asFragment()).toMatchSnapshot();
    });

    it('displays correct number of recipe cards', () => {
        const recipes = [
            { id: 1, title: 'Recipe 1', description: 'Tasty!', author_id: 1 },
            { id: 2, title: 'Recipe 2', description: 'Tastier!', author_id: 1 },
            { id: 3, title: 'Recipe 3', description: 'Tastiest!', author_id: 2 },
            { id: 4, title: 'Recipe 4', description: 'Somehow still tastier!', author_id: 2 }
        ];
        renderComponent({ recipes });
        expect(screen.getAllByRole('heading', { level: 5 })).toHaveLength(recipes.length);
    });

    it('displays no cards when recipes array is empty', () => {
        renderComponent({ recipes: [] });
        const recipeCards = screen.queryAllByRole('heading', { level: 5 });
        expect(recipeCards).toHaveLength(0);
    });

    it('correctly displays all recipe titles and descriptions', () => {
        const recipes = [
            { id: 1, title: 'Recipe 1', description: 'Tasty!', author_id: 1 },
            { id: 2, title: 'Recipe 2', description: 'Tastier!', author_id: 1 }
        ];
        renderComponent({ recipes });
        recipes.forEach((recipe) => {
            expect(screen.getByText(recipe.title)).toBeInTheDocument();
            expect(screen.getByText(recipe.description)).toBeInTheDocument();
        });
    });

    it('displays "No recipes to display." message when there are no recipes', () => {
        renderComponent({ recipes: [] });
        expect(screen.getByText("No recipes to display.")).toBeInTheDocument();
    });
});
