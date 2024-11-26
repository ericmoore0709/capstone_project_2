import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useState } from 'react';

const UpdateBioForm = ({ profile, updateProfile }) => {

    const [formData, setFormData] = useState(
        {
            bio: profile.bio || '',
        }
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Sanitize input fields before submission
        const sanitizedData = {
            userId: +profile.userId,
            bio: DOMPurify.sanitize(formData.bio)
        };

        updateProfile(sanitizedData);
    };

    return (
        <div>
            <h2 className='text-center mt-2'>Edit Bio</h2>
            <Form onSubmit={handleFormSubmit} className='w-50 mx-auto p-2 border'>
                <FormGroup>
                    <Label htmlFor='bio'>Bio</Label>
                    <Input id='bio' name='bio' value={formData.bio} onChange={handleInputChange} />
                    <FormText>Tell us about yourself!</FormText>
                </FormGroup>
                <FormGroup className='text-center'>
                    <Button color='primary' className='w-25'>Update</Button>
                </FormGroup>
            </Form>
        </div>
    );
};

UpdateBioForm.propTypes = {
    profile: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired
};

export default UpdateBioForm;
