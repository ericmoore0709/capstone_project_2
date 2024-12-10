import { DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledDropdown } from "reactstrap";

const RecipesDropdown = () => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                Recipes
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem><NavItem>
                    <NavLink className='nav-link' to={'/recipes'}>Browse Recipes</NavLink>
                </NavItem></DropdownItem>
                <DropdownItem><NavItem>
                    <NavLink className='nav-link' to={'/recipes/new'}>Create Recipe</NavLink>
                </NavItem></DropdownItem>
                <DropdownItem><NavItem>
                    <NavLink className='nav-link' to={'/recipes/my'}>My Recipes</NavLink>
                </NavItem></DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default RecipesDropdown;