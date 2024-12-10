import { NavLink } from "react-router-dom";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

const RecipesDropdown = () => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                Recipes
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem>
                    <NavLink className='nav-link' to={'/recipes'}>Browse Recipes</NavLink>
                </DropdownItem>
                <DropdownItem>
                    <NavLink className='nav-link' to={'/recipes/new'}>Create Recipe</NavLink>
                </DropdownItem>
                <DropdownItem>
                    <NavLink className='nav-link' to={'/recipes/my'}>My Recipes</NavLink>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default RecipesDropdown;