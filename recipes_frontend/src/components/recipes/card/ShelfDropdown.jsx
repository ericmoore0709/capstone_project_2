import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import useShelves from '../../../hooks/useShelves';
import PropTypes from 'prop-types';

const ShelfDropdown = ({ recipeId }) => {
    const { addRecipeToShelf, getShelfOptions } = useShelves();
    const shelfOptions = getShelfOptions();

    return (
        <UncontrolledDropdown className='position-absolute top-0 end-0'>
            <DropdownToggle color='primary'>
                +
            </DropdownToggle>
            <DropdownMenu end>
                <div className='ms-2'>Add to shelf...</div>
                <DropdownItem divider />
                {shelfOptions.map((shelf) =>
                    <DropdownItem key={shelf.id} className='text-center' onClick={() => addRecipeToShelf(shelf.id, recipeId)}>{shelf.label}</DropdownItem>
                )}
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

ShelfDropdown.propTypes = {
    recipeId: PropTypes.number.isRequired
};

export default ShelfDropdown;