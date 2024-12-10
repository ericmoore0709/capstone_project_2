import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Shelf from '../shelves/Shelf';
import useProfiles from '../../hooks/useProfiles';
import StaticUserInfo from './StaticUserInfo';
import Bio from './Bio';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Loading from '../util/Loading';

const Profile = ({ token }) => {
    const { id } = useParams();
    const signedInUser = useContext(AuthContext);
    const userId = +id || +signedInUser?.id;

    const { profile, publicShelf, isBioFormVisible, setIsBioFormVisible, updateProfile, isLoading } = useProfiles(token, userId);

    const toggleBioFormVis = () => {
        setIsBioFormVisible(!isBioFormVisible);
    }

    if (isLoading) return <Loading />

    return (
        <div>
            {profile ?
                <>
                    <div className='mb-5 w-100 mx-auto'>
                        <StaticUserInfo user={profile.user} />
                        <Bio
                            profile={profile}
                            toggleBioFormVis={toggleBioFormVis}
                            isBioFormVisible={isBioFormVisible}
                            updateProfile={updateProfile}
                        />
                    </div>

                    {publicShelf &&
                        <div>
                            <h3 className='text-center mt-5'>{`${profile.user.firstName}'s`} Public Recipes</h3>
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
    token: PropTypes.string
}

export default Profile;