import { Button, Form, FormGroup, FormText, Input, Label, ListGroup, ListGroupItem } from 'reactstrap';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import RecipesApi from '../../../api';

const UpdateShelfForm = ({ updateShelf, errors = [] }) => {

    const { id } = useParams();
    const [formData, setFormData] = useState(
        {
            label: '',
        }
    );

    useEffect(() => {
        const getShelf = async (id) => {
            const result = await RecipesApi.getShelfById(id);
            setFormData(result.shelf);
        }
        getShelf(+id);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        // Sanitize input fields before submission
        const sanitizedData = {
            id: +formData.id,
            label: DOMPurify.sanitize(formData.label)
        };

        updateShelf(sanitizedData);
    };

    return (
        <div>
            <h2 className='text-center mt-2'>Edit Shelf</h2>
            <Form onSubmit={handleFormSubmit} className='w-50 mx-auto p-2 border'>
                <FormGroup>
                    <Label htmlFor='label'>Label</Label>
                    <Input id='label' name='label' value={formData.label} onChange={handleInputChange} />
                    <FormText>Give your shelf a label!</FormText>
                </FormGroup>
                <FormGroup className='text-center'>
                    <Button color='primary' className='w-25'>Update</Button>
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

UpdateShelfForm.propTypes = {
    updateShelf: PropTypes.func.isRequired,
    errors: PropTypes.array,
    signedInUser: PropTypes.object
};

export default UpdateShelfForm;
