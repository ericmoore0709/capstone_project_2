import ProtectedRoute from "../components/nav/ProtectedRoute";
import NewRecipeForm from '../components/recipes/NewRecipeForm';
import UpdateRecipeForm from '../components/recipes/UpdateRecipeForm';
import ShelfList from '../components/shelves/ShelfList';
import NewShelfForm from '../components/shelves/NewShelfForm';
import UpdateShelfForm from '../components/shelves/UpdateShelfForm';
import Profile from '../components/profiles/Profile';
import RecipeDetails from '../components/recipes/RecipeDetails';
import useRecipes from '../hooks/useRecipes';
import useShelves from '../hooks/useShelves';
import PublicRecipeList from "../components/recipes/public/PublicRecipeList";
import UserRecipeList from "../components/recipes/user/UserRecipeList";

const RoutesConfig = () => {
    const { recipeFormErrors } = useRecipes();
    const { shelfFormErrors, removeRecipeFromShelf } = useShelves();

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
                        <PublicRecipeList />
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
                        <UserRecipeList />
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
                        <ShelfList removeRecipeFromShelf={removeRecipeFromShelf} />
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
