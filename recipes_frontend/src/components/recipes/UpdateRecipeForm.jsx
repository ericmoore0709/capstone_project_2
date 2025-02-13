import { Button, Form, FormGroup, FormText, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import useRecipes from '../../hooks/useRecipes';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../util/Loading';
import NotFound404 from '../util/NotFound404';
import FormValidationErrorsDisplay from '../util/FormValidationErrorsDisplay';

const UpdateRecipeForm = ({ updateRecipe, errors = [] }) => {

    const { id } = useParams();
    const { signedInUser } = useContext(AuthContext);
    const [formData, setFormData] = useState(
        {
            title: '',
            description: '',
            image: '',
            visibility_id: '1'
        }
    );
    const [isLoading, setIsLoading] = useState(true);

    const { getRecipeById } = useRecipes();

    useEffect(() => {
        const getRecipe = async (id) => {
            setIsLoading(true);
            const result = await getRecipeById(id);
            if (result && result?.author_id === signedInUser.id)
                setFormData(result);
            setIsLoading(false);
        }
        getRecipe(+id);
    }, [id, getRecipeById, signedInUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Sanitize input fields before submission
        const sanitizedData = {
            id: +formData.id,
            title: DOMPurify.sanitize(formData.title),
            description: DOMPurify.sanitize(formData.description),
            image: DOMPurify.sanitize(formData.image),
            visibility_id: +formData.visibility_id,
            author_id: +signedInUser.id
        };

        updateRecipe(sanitizedData);
    };

    if (isLoading) return <Loading />

    if (!formData.title) return (<NotFound404 />);

    return (
        <div>
            <h2 className='text-center mt-2'>Edit Recipe</h2>
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
                    <Button color='primary' className='w-25'>Update</Button>
                </FormGroup>
            </Form>

            {(errors.length > 0) && <FormValidationErrorsDisplay errors={errors} />}
        </div>
    );
};

UpdateRecipeForm.propTypes = {
    updateRecipe: PropTypes.func.isRequired,
    errors: PropTypes.array
};

export default UpdateRecipeForm;
