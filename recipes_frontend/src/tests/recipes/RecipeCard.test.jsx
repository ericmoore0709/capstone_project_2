import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom"; // Required for Link components
import RecipeCard from "../../components/recipes/RecipeCard";
import defaultImage from '../../assets/defaultImage.jpg';

describe('RecipeCard', () => {
    const mockRecipe = {
        id: 1,
        title: "Recipe 1",
        description: "Tasty!",
        image: null,
        author_id: 1
    };

    const mockSignedInUser = { id: 1 };
    const mockDelete = vi.fn();

    const renderComponent = (recipe = mockRecipe, signedInUser = mockSignedInUser) => {
        return render(
            <MemoryRouter>
                <RecipeCard recipe={recipe} signedInUser={signedInUser} deleteRecipe={mockDelete} />
            </MemoryRouter>
        );
    };

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders without crashing', () => {
        renderComponent();
    });

    it('takes a snapshot', () => {
        const { asFragment } = renderComponent();
        expect(asFragment()).toMatchSnapshot();
    });

    it('correctly displays title and description', () => {
        renderComponent();
        expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
        expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
    });

    it('displays the default image if no image is provided', () => {
        renderComponent();
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', defaultImage);
        expect(img).toHaveAttribute('alt', mockRecipe.title);
    });

    it('displays the recipe image if provided', () => {
        const customRecipe = { ...mockRecipe, image: "https://via.placeholder.com/150" };
        renderComponent(customRecipe);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', customRecipe.image);
    });

    it('correctly displays "See more!" button', () => {
        renderComponent();
        const seeMoreLink = screen.getByRole('link', { name: /see more!/i });
        expect(seeMoreLink).toBeInTheDocument();
        expect(seeMoreLink).toHaveAttribute('href', `/recipes/${mockRecipe.id}`);
    });

    it('conditionally displays "Edit" button for author', () => {
        renderComponent();
        const editLink = screen.getByRole('link', { name: /edit/i });
        expect(editLink).toBeInTheDocument();
        expect(editLink).toHaveAttribute('href', `/recipes/${mockRecipe.id}/edit`);
    });

    it('does not display "Edit" button for non-author', () => {
        const nonAuthorUser = { id: 2 }; // Different user ID
        renderComponent(mockRecipe, nonAuthorUser);
        const editButton = screen.queryByRole('link', { name: /edit/i });
        expect(editButton).not.toBeInTheDocument();
    });

    it('conditionally displays "Delete" button for author', () => {
        renderComponent();
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        expect(deleteButton).toBeInTheDocument();
    });

    it('does not display "Delete" button for non-author', () => {
        const nonAuthorUser = { id: 2 }; // Different user ID
        renderComponent(mockRecipe, nonAuthorUser);
        const deleteButton = screen.queryByRole('button', { name: /delete/i });
        expect(deleteButton).not.toBeInTheDocument();
    });

    it('handles delete button click with confirm', () => {
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
        renderComponent();
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(mockDelete).toHaveBeenCalled();
    });

    it('handles delete button click with reject', () => {
        vi.spyOn(window, 'confirm').mockImplementation(() => false);
        renderComponent();
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        fireEvent.click(deleteButton);
        expect(mockDelete).not.toHaveBeenCalled();
    });
});
