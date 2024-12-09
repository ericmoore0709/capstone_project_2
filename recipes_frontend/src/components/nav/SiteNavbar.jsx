import { useContext, useState } from "react";
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, UncontrolledDropdown } from "reactstrap";
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from "../../contexts/AuthContext";

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
                        </> : <>
                            <NavItem>
                                <NavLink className='nav-link' to={`${import.meta.env.VITE_BACKEND_URI}/auth/google`}>Sign in</NavLink>
                            </NavItem>
                        </>}
                    </Nav>
                    <Nav className="ms-auto" navbar>
                        {signedInUser && <>
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