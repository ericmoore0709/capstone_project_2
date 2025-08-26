import PropTypes from 'prop-types';
import RecipeCard from '../RecipeCard';
import useShelves from '../../../hooks/useShelves';

const PublicRecipeCard = ({ recipe }) => {
    const { getShelfOptions } = useShelves();

    return (
        <RecipeCard recipe={recipe} shelfOptions={getShelfOptions()} />
    );
}

PublicRecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired
};

export default PublicRecipeCard;