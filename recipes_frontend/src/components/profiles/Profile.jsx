import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Shelf from '../shelves/Shelf';
import { Button } from 'reactstrap';
import UpdateBioForm from './UpdateBioForm';
import useProfiles from '../../hooks/useProfiles';
// import useProfiles from '../../hooks/useProfiles';

const Profile = ({ signedInUser, token }) => {
    const { id } = useParams();
    const userId = +id || +signedInUser?.id;

    const { profile, publicShelf, isBioFormVisible, setIsBioFormVisible, updateProfile } = useProfiles(token, userId);

    return (
        <div>
            {profile ?
                <>
                    <div className='mb-5 w-100 mx-auto'>
                        <div className='d-flex'>
                            <img className='rounded d-block img-thumbnail mx-auto' src={profile?.user.image} />
                        </div>
                        <div className='mt-3'>
                            <h1>{`${profile?.user.firstName} ${profile?.user.lastName}`}</h1>
                        </div>
                        <div className='w-100 text-center mx-auto'>
                            <small>{profile.user.email}</small>
                        </div>
                        <div className='text-center mx-auto mt-4'>
                            {profile?.bio && <small className='d-block'>&quot;{profile?.bio}&quot;</small>}
                            {(profile?.userId === signedInUser.id) && <Button className='my-3' onClick={() => setIsBioFormVisible(!isBioFormVisible)}>Update Bio</Button>}
                            {isBioFormVisible && <UpdateBioForm profile={profile} updateProfile={updateProfile} />}
                        </div>
                    </div>

                    {publicShelf &&
                        <div>
                            <h3 className='text-center mt-5'>{`${profile?.user.firstName}'s`} Public Recipes</h3>
                            <Shelf shelf={publicShelf} signedInUser={signedInUser} />
                        </div>
                    }
                </>
                :
                <h1>404 - Not Found</h1>
            }
        </div>
    )
}

Profile.propTypes = {
    signedInUser: PropTypes.object,
    token: PropTypes.string
}

export default Profile;