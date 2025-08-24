import PropTypes from 'prop-types';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const ShelfDropdown = ({ shelfOptions, handleAddRecipeToShelf }) => {
    return (
        <UncontrolledDropdown className='position-absolute top-0 end-0'>
            <DropdownToggle color='primary'>
                +
            </DropdownToggle>
            <DropdownMenu end>
                <div className='ms-2'>Add to shelf...</div>
                <DropdownItem divider />
                {shelfOptions.map((shelf) =>
                    <DropdownItem key={shelf.id} className='text-center' onClick={() => handleAddRecipeToShelf(shelf.id)}>{shelf.label}</DropdownItem>
                )}
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

ShelfDropdown.propTypes = {
    shelfOptions: PropTypes.array.isRequired,
    handleAddRecipeToShelf: PropTypes.func.isRequired
}

export default ShelfDropdown;