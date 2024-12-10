import { useContext, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from "reactstrap";
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from "../../contexts/AuthContext";
import RecipesDropdown from "./dropdowns/RecipesDropdown";
import ShelvesDropdown from "./dropdowns/ShelvesDropdown";
import ProfilesDropdown from "./dropdowns/ProfilesDropdown";

const SiteNavbar = ({ logoutUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const signedInUser = useContext(AuthContext);

    return (
        <div>
            <Navbar expand='md'>
                <NavbarBrand href="/">Culinarie</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        {signedInUser ? <>
                            <RecipesDropdown />
                            <ShelvesDropdown />
                        </> : <>
                            <NavItem>
                                <NavLink className='nav-link' to={`${import.meta.env.VITE_BACKEND_URI}/auth/google`}>Sign in</NavLink>
                            </NavItem>
                        </>}
                    </Nav>
                    <Nav className="ms-auto" navbar>
                        {signedInUser && <>
                            <ProfilesDropdown logoutUser={logoutUser} />
                        </>}
                    </Nav>
                </Collapse>
            </Navbar>
        </div >
    );
}

SiteNavbar.propTypes = {
    logoutUser: PropTypes.func.isRequired
}

export default SiteNavbar;