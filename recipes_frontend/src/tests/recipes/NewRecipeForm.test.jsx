import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NewRecipeForm from "../../components/recipes/NewRecipeForm";

describe('NewRecipeForm', () => {

    const mockSignedInUser = { id: 1 };
    const mockErrors = [];

    it('renders without crashing', () => {
        render(<NewRecipeForm addRecipe={vi.fn()} signedInUser={mockSignedInUser} errors={mockErrors} />);
    });

    it('takes a snapshot', () => {
        const { asFragment } = render(<NewRecipeForm addRecipe={vi.fn()} signedInUser={mockSignedInUser} errors={mockErrors} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('correctly updates title input', () => {
        render(<NewRecipeForm addRecipe={vi.fn()} signedInUser={mockSignedInUser} errors={mockErrors} />);
        const titleInput = screen.getByLabelText(/title/i);
        fireEvent.change(titleInput, { target: { value: 'Recipe 1' } });
        expect(titleInput).toHaveValue("Recipe 1");
    });

    it('correctly updates description input', () => {
        render(<NewRecipeForm addRecipe={vi.fn()} signedInUser={mockSignedInUser} errors={mockErrors} />);
        const descriptionInput = screen.getByLabelText(/description/i);
        fireEvent.change(descriptionInput, { target: { value: 'Tasty!' } });
        expect(descriptionInput).toHaveValue("Tasty!");
    });

    it('clears formData upon formSubmit', () => {
        render(<NewRecipeForm addRecipe={vi.fn()} signedInUser={mockSignedInUser} errors={mockErrors} />);

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);

        fireEvent.change(titleInput, { target: { value: 'Recipe 1' } });
        fireEvent.change(descriptionInput, { target: { value: 'Tasty!' } });

        expect(titleInput).toHaveValue('Recipe 1');
        expect(descriptionInput).toHaveValue('Tasty!');

        fireEvent.click(screen.getByRole('button'));

        expect(titleInput).toHaveValue('');
        expect(descriptionInput).toHaveValue('');
    });

    it('calls addRecipe when submitted', () => {
        const addRecipeMock = vi.fn();

        render(<NewRecipeForm addRecipe={addRecipeMock} signedInUser={mockSignedInUser} errors={mockErrors} />);

        const titleInput = screen.getByLabelText(/title/i);
        const descriptionInput = screen.getByLabelText(/description/i);

        fireEvent.change(titleInput, { target: { value: 'Recipe 1' } });
        fireEvent.change(descriptionInput, { target: { value: 'Tasty!' } });

        fireEvent.click(screen.getByRole('button'));

        expect(addRecipeMock).toHaveBeenCalled();
    });

    it('displays error messages when inputs are empty', () => {
        const addRecipeMock = vi.fn();
        const errorMessages = ['Title cannot be blank.', 'Description cannot be blank.'];

        render(<NewRecipeForm addRecipe={addRecipeMock} signedInUser={mockSignedInUser} errors={errorMessages} />);

        fireEvent.click(screen.getByRole('button'));

        expect(screen.getByText('Title cannot be blank.')).toBeInTheDocument();
        expect(screen.getByText('Description cannot be blank.')).toBeInTheDocument();
    });
});
