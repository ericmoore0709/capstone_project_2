import { Button, Card, CardBody, CardImg, CardText, CardTitle, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/defaultImage.jpg';

const RecipeCard = ({ recipe, signedInUser, deleteRecipe, shelfOptions, addRecipeToShelf, handleRemoveRecipeFromShelf }) => {

    const handleAddRecipeToShelf = async (shelfId) => {
        addRecipeToShelf(shelfId, recipe.id);
    }

    const deletionConfirmed = (msg) => {
        return window.confirm(msg);
    }

    const handleOnDelete = (id) => {
        if (deletionConfirmed('Are you sure you want to delete this recipe?')) {
            deleteRecipe(id);
        }
    }

    return (
        <div className='p-2 d-flex'>
            <Card style={{ minWidth: '200px', minHeight: '250px', width: '23vw' }}>

                {/* At-a-glance recipe info */}
                <Link to={`/recipes/${recipe.id}`}><CardImg src={recipe.image || defaultImage} alt={recipe.title} style={{ maxHeight: '150px', objectFit: 'cover' }} /></Link>
                {shelfOptions &&
                    <UncontrolledDropdown className='position-absolute top-0 end-0'>
                        <DropdownToggle color='primary'>
                            +
                        </DropdownToggle>
                        <DropdownMenu end>
                            <div className='ms-2'>Add to shelf...</div>
                            <DropdownItem divider />
                            {shelfOptions.map((shelf) =>
                                <DropdownItem key={shelf.id} className='text-center' onClick={() => handleAddRecipeToShelf(shelf.id)}>{shelf.label}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                }

                {handleRemoveRecipeFromShelf &&
                    <Button onClick={() => handleRemoveRecipeFromShelf(recipe.id)} color='danger' className='position-absolute top-0 end-0'>-</Button>
                }

                <CardBody className='d-flex flex-column'>
                    <CardTitle tag='h5' className='text-center'><Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link></CardTitle>
                    <CardText className='text-truncate' style={{ maxHeight: '3em', overflow: 'hidden' }}>{recipe.description}</CardText>
                </CardBody>

                {/* Meta Info*/}
                {recipe.author && <>
                    <small>
                        <div className='d-flex'>
                            <div className='w-25 text-start mx-1'>
                                <div><strong>Uploaded</strong></div>
                                <div>{new Date(recipe.uploaded_at).toLocaleDateString()}</div>
                            </div>
                            <div className='w-50 text-center mx-auto'>
                                <div><strong>Author</strong></div>
                                <div><Link to={`/profiles/${recipe.author.id}`}>{`${recipe.author.firstName} ${recipe.author.lastName}`}</Link></div>
                            </div>
                            <div className='w-25 text-end mx-1'>
                                <div><strong>Last Updated</strong></div>
                                <div>{new Date(recipe.last_updated_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </small>

                    {/* Author controls */}
                    {(recipe.author_id === signedInUser.id) && <div className='text-center'>
                        <Link to={`/recipes/${recipe.id}/edit`} className='w-50 btn btn-secondary mb-1'>Edit</Link>
                        <Button color='danger' className='w-50 mb-1' onClick={() => handleOnDelete(recipe.id)}>Delete</Button>
                    </div>}
                </>}
            </Card>
        </div>
    );
}

RecipeCard.propTypes = {
    recipe: PropTypes.object.isRequired,
    signedInUser: PropTypes.object,
    deleteRecipe: PropTypes.func,
    shelfOptions: PropTypes.array,
    addRecipeToShelf: PropTypes.func,
    handleRemoveRecipeFromShelf: PropTypes.func
};

export default RecipeCard;
