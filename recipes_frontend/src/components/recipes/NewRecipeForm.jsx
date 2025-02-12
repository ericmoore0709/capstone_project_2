import { Button, Form, FormGroup, FormText, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import DOMPurify from 'dompurify';
import { AuthContext } from '../../contexts/AuthContext';

const NewRecipeForm = ({ addRecipe, errors = [] }) => {

    const INITIAL_FORM_DATA = {
        title: '',
        description: '',
        image: '',
        visibility_id: 1, // default to 'Public'
    };

    const { signedInUser } = useContext(AuthContext);

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Sanitize input fields before submission
        const sanitizedData = {
            title: DOMPurify.sanitize(formData.title),
            description: DOMPurify.sanitize(formData.description),
            image: DOMPurify.sanitize(formData.image),
            visibility_id: +formData.visibility_id,
            author_id: signedInUser.id
        };

        addRecipe(sanitizedData);
        setFormData(INITIAL_FORM_DATA);
    };

    return (
        <div>
            <h2 className='text-center mt-2'>Create a Recipe</h2>
            <Form onSubmit={handleFormSubmit} className='w-50 mx-auto p-2 border'>
                <FormGroup>
                    <Label htmlFor='title'>Title</Label>
                    <Input id='title' name='title' value={formData.title} onChange={handleInputChange} />
                    <FormText>Give your recipe a name!</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='description'>Description</Label>
                    <Input id='description' name='description' value={formData.description} onChange={handleInputChange} />
                    <FormText>Give a light description of your delicious masterpiece!</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='image'>Image URL</Label>
                    <Input id='image' name='image' value={formData.image} onChange={handleInputChange} />
                    <FormText>Show us an image of your finished meal.</FormText>
                </FormGroup>
                <FormGroup>
                    <Label htmlFor='visibility_id'>Visibility</Label>
                    <Input type='select' name='visibility_id' id='visibility_id' value={formData.visibility_id} onChange={handleInputChange}>
                        <option value="1">Public</option>
                        <option value="2">Community</option>
                        <option value="3">Private</option>
                    </Input>
                    <FormText>Select who can view your recipe.</FormText>
                </FormGroup>
                <FormGroup className='text-center'>
                    <Button color='primary' className='w-25'>Add</Button>
                </FormGroup>
            </Form>

            {(errors.length > 0) && (
                <div>
                    <ListGroup color='danger' className='w-50 mx-auto'>
                        {errors.map((err, index) => (
                            <ListGroupItem key={index} color='danger'>{err}</ListGroupItem>
                        ))}
                    </ListGroup>
                </div>
            )}
        </div>
    );
};

NewRecipeForm.propTypes = {
    addRecipe: PropTypes.func.isRequired,
    errors: PropTypes.array,
    signedInUser: PropTypes.object
};

export default NewRecipeForm;
