import { CardGroup } from 'reactstrap';
import PropTypes from 'prop-types';
import Shelf from './Shelf';
import Loading from '../util/Loading';
import useShelves from '../../hooks/useShelves';

const ShelfList = () => {
    const { userShelves: shelves, loading, deleteShelf, removeRecipeFromShelf } = useShelves();

    if (loading) return <Loading />

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
                        removeRecipeFromShelf={removeRecipeFromShelf}
                    />
                ))}
            </CardGroup>
        </div>
    );
}

ShelfList.propTypes = {};

export default ShelfList;
