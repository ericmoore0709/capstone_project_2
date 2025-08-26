import ProtectedRoute from "../components/nav/ProtectedRoute";
import RecipeList from "../components/recipes/RecipeList";
import NewRecipeForm from '../components/recipes/NewRecipeForm';
import UpdateRecipeForm from '../components/recipes/UpdateRecipeForm';
import ShelfList from '../components/shelves/ShelfList';
import NewShelfForm from '../components/shelves/NewShelfForm';
import UpdateShelfForm from '../components/shelves/UpdateShelfForm';
import Profile from '../components/profiles/Profile';
import RecipeDetails from '../components/recipes/RecipeDetails';
import useRecipes from '../hooks/useRecipes';
import useShelves from '../hooks/useShelves';

const RoutesConfig = () => {
    const { publicRecipes, userRecipes, publicLoading, userLoading, recipeFormErrors, addRecipe, getRecipeById, updateRecipe, deleteRecipe } = useRecipes();
    const { userShelves, loading: shelvesLoading, shelfFormErrors, addShelf, getShelf, updateShelf, deleteShelf, addRecipeToShelf, getShelfOptions, removeRecipeFromShelf } = useShelves();

    return [
        {
            path: '/',
            element: (
                <ProtectedRoute element={<h1>Home</h1>} />
            ),
        },
        {
            path: '/recipes',
            element: (
                <ProtectedRoute
                    element={
                        <RecipeList
                            title="Public Recipes"
                            recipes={publicRecipes}
                            loading={publicLoading}
                            deleteRecipe={deleteRecipe}
                            shelfOptions={getShelfOptions()}
                            addRecipeToShelf={addRecipeToShelf}
                        />
                    }
                />
            ),
        },
        {
            path: '/recipes/:id',
            element: (<ProtectedRoute element={<RecipeDetails />} />),
        },
        {
            path: '/recipes/new',
            element: (
                <ProtectedRoute
                    element={
                        <NewRecipeForm
                            getRecipeById={getRecipeById}
                            addRecipe={addRecipe}
                            errors={recipeFormErrors}
                        />
                    }
                />
            ),
        },
        {
            path: '/recipes/my',
            element: (
                <ProtectedRoute
                    element={
                        <RecipeList
                            title="My Recipes"
                            recipes={userRecipes}
                            loading={userLoading}
                            deleteRecipe={deleteRecipe}
                        />
                    }
                />
            ),
        },
        {
            path: '/recipes/:id/edit',
            element: (
                <ProtectedRoute
                    element={
                        <UpdateRecipeForm
                            updateRecipe={updateRecipe}
                            errors={recipeFormErrors}
                        />
                    }
                />
            ),
        },
        {
            path: '/shelves',
            element: (
                <ProtectedRoute
                    element={
                        <ShelfList
                            shelves={userShelves}
                            loading={shelvesLoading}
                            updateShelf={updateShelf}
                            errors={shelfFormErrors}
                            deleteShelf={deleteShelf}
                            removeRecipeFromShelf={removeRecipeFromShelf}
                        />
                    }
                />
            ),
        },
        {
            path: '/shelves/new',
            element: (
                <ProtectedRoute
                    element={
                        <NewShelfForm
                            addShelf={addShelf}
                            errors={shelfFormErrors}
                        />
                    }
                />
            ),
        },
        {
            path: '/shelves/:id/edit',
            element: (
                <ProtectedRoute
                    element={
                        <UpdateShelfForm
                            getShelf={getShelf}
                            updateShelf={updateShelf}
                            errors={shelfFormErrors}
                        />
                    }
                />
            ),
        },
        {
            path: '/profiles/my',
            element: (
                <ProtectedRoute
                    element={<Profile />}
                />
            ),
        },
        {
            path: '/profiles/:id',
            element: (
                <ProtectedRoute
                    element={<Profile />}
                />
            ),
        },
    ];
}

export default RoutesConfig;
