import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const ModelDropdown = ({ title, routes, end }) => {
    return (
        <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
                {title}
            </DropdownToggle>
            <DropdownMenu end={end}>
                {routes.map(({ path, label }, index) => (
                    <DropdownItem key={index}>
                        <NavLink className="nav-link" to={path}>{label}</NavLink>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

ModelDropdown.propTypes = {
    title: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    ).isRequired,
    end: PropTypes.bool
}

export default ModelDropdown;