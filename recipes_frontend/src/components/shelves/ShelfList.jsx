import { CardGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import Shelf from './Shelf';

const ShelfList = ({ shelves, deleteShelf, signedInUser, removeRecipeFromShelf }) => {
    return (
        <div>
            <h2 className='text-center mt-2'>My Shelves</h2>

            {/* Show message if there are no shelves to display */}
            {shelves.length === 0 && (
                <p className="text-center my-3">No shelves to display.</p>
            )}

            {/* Render shelves if available */}
            <CardGroup className='d-flex flex-wrap m-1'>
                {shelves.map((shelf) => (
                    <Shelf
                        key={shelf.id}
                        shelf={shelf}
                        deleteShelf={deleteShelf}
                        signedInUser={signedInUser}
                        removeRecipeFromShelf={removeRecipeFromShelf}
                    />
                ))}
            </CardGroup>
        </div>
    );
}

ShelfList.propTypes = {
    shelves: PropTypes.array.isRequired,
    signedInUser: PropTypes.object.isRequired,
    deleteShelf: PropTypes.func,
    removeRecipeFromShelf: PropTypes.func.isRequired
};

export default ShelfList;
