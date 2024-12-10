import { DropdownItem, DropdownMenu, DropdownToggle, NavItem, NavLink, UncontrolledDropdown } from "reactstrap";
import PropTypes from 'prop-types';

const ProfilesDropdown = ({ logoutUser }) => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                Profiles
            </DropdownToggle>
            <DropdownMenu end>
                <DropdownItem><NavItem>
                    <NavLink className='nav-link' to={'/profiles/my'}>My Profile</NavLink>
                </NavItem></DropdownItem>
                <DropdownItem divider />
                <DropdownItem><NavItem>
                    <NavLink className='nav-link text-danger' onClick={logoutUser}>Logout</NavLink>
                </NavItem></DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

ProfilesDropdown.propTypes = {
    logoutUser: PropTypes.func.isRequired
}

export default ProfilesDropdown;