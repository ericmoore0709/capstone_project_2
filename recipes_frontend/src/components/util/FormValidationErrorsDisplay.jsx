import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';

const FormValidationErrorsDisplay = ({ errors }) => {
    return (
        <div>
            <ListGroup color='danger' className='w-50 mx-auto'>
                {errors.map((err, index) => (
                    <ListGroupItem key={index} color='danger'>{err}</ListGroupItem>
                ))}
            </ListGroup>
        </div>
    )
}

FormValidationErrorsDisplay.propTypes = {
    errors: PropTypes.array.isRequired
}

export default FormValidationErrorsDisplay;