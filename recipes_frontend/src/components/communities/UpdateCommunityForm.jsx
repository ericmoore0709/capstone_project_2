import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCommunities from "../../hooks/useCommunities";
import { useEffect, useState } from "react";
import Loading from "../util/Loading";
import NotFound404 from "../util/NotFound404";
import { Form, FormGroup, Button, Input, Label } from "reactstrap";
import FormValidationErrorsDisplay from "../util/FormValidationErrorsDisplay";

const UpdateCommunityForm = () => {
    const { id } = useParams();
    const { signedInUser } = useAuth();
    const { getCommunityById, updateCommunity, formErrors: errors } = useCommunities();
    const [formData, setFormData] = useState(
        {
            name: '',
            description: '',
            image: '',
            admin_id: signedInUser?.id
        }
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getCommunity = async (id) => {
            setIsLoading(true);
            const result = await getCommunityById(id);
            if (result && result?.admin_id === signedInUser.id)
                setFormData((prev) => (result));
            setIsLoading(false);
        }
        getCommunity(+id);
    }, [id, getCommunityById, signedInUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const relevantData = {
            id: +formData.id,
            name: formData.name,
            description: formData.description,
            image: formData.image,
            admin_id: formData.admin_id
        };
        updateCommunity(relevantData);
    };

    if (isLoading) return <Loading />
    if (!formData.name) return (<NotFound404 />);

    return (
        <div>
            <h2 className='text-center mt-2'>Edit Recipe</h2>
            <Form onSubmit={handleFormSubmit} className='w-50 mx-auto p-2 border'>
                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                        type="textarea"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="image">Image URL</Label>
                    <Input
                        type="url"
                        name="image"
                        id="image"
                        value={formData.image}
                        onChange={handleInputChange}
                    />
                </FormGroup>
                <FormGroup className='text-center'>
                    <Button color='primary' className='w-25'>Update</Button>
                </FormGroup>
            </Form>
            {(errors.length > 0) && <FormValidationErrorsDisplay errors={errors} />}
        </div>
    )
}

UpdateCommunityForm.propTypes = {};

export default UpdateCommunityForm;