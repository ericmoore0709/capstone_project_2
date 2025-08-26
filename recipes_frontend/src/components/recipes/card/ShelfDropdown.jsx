import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import useRecipes from '../../../hooks/useRecipes';
import useShelves from '../../../hooks/useShelves';

const ShelfDropdown = () => {
    const { addRecipeToShelf } = useRecipes();
    const { getShelfOptions } = useShelves();

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
                    <DropdownItem key={shelf.id} className='text-center' onClick={() => addRecipeToShelf(shelf.id)}>{shelf.label}</DropdownItem>
                )}
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default ShelfDropdown;