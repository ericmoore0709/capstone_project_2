import { useState } from "react";
import useCommunities from "../../hooks/useCommunities";
import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import FormValidationErrorsDisplay from "../util/FormValidationErrorsDisplay";
import useAuth from "../../hooks/useAuth";

const NewCommunityForm = () => {
    const { signedInUser } = useAuth();
    const { addCommunity, formErrors: errors } = useCommunities();

    const INITIAL_FORM_DATA = {
        name: '',
        description: '',
        image: '',
        admin_id: signedInUser?.id
    };

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        addCommunity(formData);
        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <div>
            <h2 className='text-center mt-2'>Create a Community</h2>
            <Form onSubmit={handleFormSubmit} className='w-50 mx-auto p-2 border'>
                <FormGroup>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                    <FormText>Enter the name of your community.</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" value={formData.description} onChange={handleInputChange} />
                    <FormText>Provide a brief description of your community.</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="image">Image URL</Label>
                    <Input id="image" name="image" value={formData.image} onChange={handleInputChange} />
                    <FormText>Optionally, provide an image URL for your community.</FormText>
                </FormGroup>
                <FormGroup className='text-center'>
                    <Button color='primary' className='w-25'>Add</Button>
                </FormGroup>
            </Form>
            {(errors.length > 0) && <FormValidationErrorsDisplay errors={errors} />}
        </div>
    );
}

NewCommunityForm.propTypes = {};

export default NewCommunityForm;