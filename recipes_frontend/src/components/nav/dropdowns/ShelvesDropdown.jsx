import { NavLink } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

const ShelvesDropdown = () => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                Shelves
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem>
                    <NavLink className='nav-link' to={'/shelves'}>My Shelves</NavLink>
                </DropdownItem>
                <DropdownItem>
                    <NavLink className='nav-link' to={'/shelves/new'}>Create Shelf</NavLink>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default ShelvesDropdown;