import { useContext, useState } from "react";
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem } from "reactstrap";
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from "../../contexts/AuthContext";
import ProfilesDropdown from "./dropdowns/ProfilesDropdown";
import ModelDropdown from "./dropdowns/ModelDropdown";

const SiteNavbar = ({ logoutUser }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const { signedInUser } = useContext(AuthContext);

    return (
        <div>
            <Navbar expand='md'>
                <NavbarBrand href="/">Culinarie</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        {signedInUser ? <>
                            <ModelDropdown title="Recipes" routes={[
                                { path: '/recipes', label: 'Browse Recipes' },
                                { path: '/recipes/new', label: 'Create Recipe' },
                                { path: '/recipes/my', label: 'My Recipes' }
                            ]} />
                            <ModelDropdown title="Shelves" routes={[
                                { path: '/shelves', label: 'My Shelves' },
                                { path: '/shelves/new', label: 'Create shelf' }
                            ]} />
                            <ModelDropdown title="Communities" routes={[
                                { path: '/communities', label: 'Browse Communities' },
                                { path: '/communities/new', label: 'Create Community' },
                                { path: '/communities/my', label: 'My Communities' }
                            ]} />
                        </> : <>
                            <NavItem>
                                <NavLink className='nav-link' to={`${import.meta.env.VITE_BACKEND_URI}/auth/google`}>Sign in</NavLink>
                            </NavItem>
                        </>}
                    </Nav>
                    <Nav className="ms-auto" navbar>
                        {signedInUser && <ProfilesDropdown logoutUser={logoutUser} />}
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