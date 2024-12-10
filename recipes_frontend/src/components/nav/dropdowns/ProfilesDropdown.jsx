import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";

const ProfilesDropdown = ({ logoutUser }) => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                Profiles
            </DropdownToggle>
            <DropdownMenu end>
                <DropdownItem>
                    <NavLink className='nav-link' to={'/profiles/my'}>My Profile</NavLink>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                    <NavLink className='nav-link text-danger' onClick={logoutUser}>Logout</NavLink>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

ProfilesDropdown.propTypes = {
    logoutUser: PropTypes.func.isRequired
}

export default ProfilesDropdown;