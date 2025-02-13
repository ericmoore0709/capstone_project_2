import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import DOMPurify from 'dompurify';
import { AuthContext } from '../../contexts/AuthContext';
import FormValidationErrorsDisplay from '../util/FormValidationErrorsDisplay';

const NewShelfForm = ({ addShelf, errors = [] }) => {

    const { signedInUser } = useContext(AuthContext);

    const INITIAL_FORM_DATA = {
        label: '',
    };

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Sanitize input fields before submission
        const sanitizedData = {
            label: DOMPurify.sanitize(formData.label),
            user_id: signedInUser.id
        };

        addShelf(sanitizedData);
        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <div>
            <h2 className='text-center mt-2'>Create a Recipe</h2>
            <Form onSubmit={handleFormSubmit} className='w-50 mx-auto p-2 border'>
                <FormGroup>
                    <Label htmlFor='label'>Label</Label>
                    <Input id='label' name='label' value={formData.label} onChange={handleInputChange} />
                    <FormText>Give your shelf a name!</FormText>
                </FormGroup>
                <FormGroup className='text-center'>
                    <Button color='primary' className='w-25'>Add</Button>
                </FormGroup>
            </Form>

            {(errors.length > 0) && <FormValidationErrorsDisplay errors={errors} />}
        </div>
    );
};

NewShelfForm.propTypes = {
    addShelf: PropTypes.func.isRequired,
    errors: PropTypes.array,
};

export default NewShelfForm;
