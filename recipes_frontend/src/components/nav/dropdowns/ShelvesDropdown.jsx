import { DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledDropdown } from "reactstrap";

const ShelvesDropdown = () => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                Shelves
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><NavItem>
                    <NavLink className='nav-link' to={'/shelves'}>My Shelves</NavLink>
                </NavItem></DropdownItem>
                <DropdownItem><NavItem>
                    <NavLink className='nav-link' to={'/shelves/new'}>Create Shelf</NavLink>
                </NavItem></DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default ShelvesDropdown;