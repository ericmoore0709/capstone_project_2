import ProtectedRoute from "../components/nav/ProtectedRoute";
import RecipeList from "../components/recipes/RecipeList";
import NewRecipeForm from '../components/recipes/NewRecipeForm';
import UpdateRecipeForm from '../components/recipes/UpdateRecipeForm';
import ShelfList from '../components/shelves/ShelfList';
import NewShelfForm from '../components/shelves/NewShelfForm';
import UpdateShelfForm from '../components/shelves/UpdateShelfForm';
import Profile from '../components/profiles/Profile';
import RecipeDetails from '../components/recipes/RecipeDetails';

const routes = (handlers) => [
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
                        recipes={handlers.publicRecipes}
                        loading={handlers.publicLoading}
                        deleteRecipe={handlers.deleteRecipe}
                        shelfOptions={handlers.getShelfOptions()}
                        addRecipeToShelf={handlers.addRecipeToShelf}
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
                        getRecipeById={handlers.getRecipeById}
                        addRecipe={handlers.addRecipe}
                        errors={handlers.recipeFormErrors}
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
                        recipes={handlers.userRecipes}
                        loading={handlers.userLoading}
                        deleteRecipe={handlers.deleteRecipe}
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
                        updateRecipe={handlers.updateRecipe}
                        errors={handlers.recipeFormErrors}
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
                        shelves={handlers.userShelves}
                        loading={handlers.shelvesLoading}
                        updateShelf={handlers.updateShelf}
                        errors={handlers.shelfFormErrors}
                        deleteShelf={handlers.deleteShelf}
                        removeRecipeFromShelf={handlers.removeRecipeFromShelf}
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
                        addShelf={handlers.addShelf}
                        errors={handlers.shelfFormErrors}
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
                        getShelf={handlers.getShelf}
                        updateShelf={handlers.updateShelf}
                        errors={handlers.shelfFormErrors}
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

export default routes;
