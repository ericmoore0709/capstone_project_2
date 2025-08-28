import ProtectedRoute from "../components/nav/ProtectedRoute";
import NewRecipeForm from '../components/recipes/NewRecipeForm';
import UpdateRecipeForm from '../components/recipes/UpdateRecipeForm';
import NewShelfForm from '../components/shelves/NewShelfForm';
import UpdateShelfForm from '../components/shelves/UpdateShelfForm';
import Profile from '../components/profiles/Profile';
import RecipeDetails from '../components/recipes/RecipeDetails';
import PublicRecipeList from "../components/recipes/public/PublicRecipeList";
import UserRecipeList from "../components/recipes/user/UserRecipeList";
import UserShelfList from "../components/shelves/user/UserShelfList";
import NewCommunityForm from "../components/communities/NewCommunityForm";
import CommunityDetails from "../components/communities/CommunityDetails";
import UserCommunityList from "../components/communities/user/UserCommunityList";
import PublicCommunityList from "../components/communities/public/PublicCommunityList";
import UpdateCommunityForm from "../components/communities/UpdateCommunityForm";

export default [
    {
        path: '/',
        element: (
            <ProtectedRoute element={<h1>Home</h1>} />
        ),
    },
    {
        path: '/recipes',
        element: (
            <ProtectedRoute element={<PublicRecipeList />} />
        ),
    },
    {
        path: '/recipes/:id',
        element: (<ProtectedRoute element={<RecipeDetails />} />),
    },
    {
        path: '/recipes/new',
        element: (
            <ProtectedRoute element={<NewRecipeForm />} />
        ),
    },
    {
        path: '/recipes/my',
        element: (
            <ProtectedRoute
                element={<UserRecipeList />}
            />
        ),
    },
    {
        path: '/recipes/:id/edit',
        element: (
            <ProtectedRoute element={<UpdateRecipeForm />} />
        ),
    },
    {
        path: '/shelves',
        element: (
            <ProtectedRoute element={<UserShelfList />} />
        ),
    },
    {
        path: '/shelves/new',
        element: (
            <ProtectedRoute element={<NewShelfForm />} />
        ),
    },
    {
        path: '/shelves/:id/edit',
        element: (
            <ProtectedRoute element={<UpdateShelfForm />} />
        ),
    },
    {
        path: '/profiles/my',
        element: (
            <ProtectedRoute element={<Profile />} />
        ),
    },
    {
        path: '/profiles/:id',
        element: (
            <ProtectedRoute element={<Profile />} />
        ),
    },
    {
        path: '/communities',
        element: (
            <ProtectedRoute element={<PublicCommunityList />} />
        ),
    },
    {
        path: '/communities/new',
        element: (
            <ProtectedRoute element={<NewCommunityForm />} />
        ),
    },
    {
        path: '/communities/:id',
        element: (
            <ProtectedRoute element={<CommunityDetails />} />
        ),
    },
    {
        path: '/communities/my',
        element: (
            <ProtectedRoute element={<UserCommunityList />} />
        ),
    },
    {
        path: '/communities/:id/edit',
        element: (
            <ProtectedRoute element={<UpdateCommunityForm />} />
        ),
    }
];
