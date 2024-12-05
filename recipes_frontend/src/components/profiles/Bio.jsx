import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import UpdateBioForm from './UpdateBioForm'
import useAuth from '../../hooks/useAuth'

const Bio = ({ profile, toggleBioFormVis, isBioFormVisible, updateProfile }) => {

    const { signedInUser } = useAuth();

    const handleOnBioFormButtonClick = () => {
        toggleBioFormVis();
    }

    return (
        <>
            {profile &&
                <div className='text-center mx-auto mt-4'>
                    {profile.bio && <small className='d-block'>&quot;{profile.bio}&quot;</small>}
                    {(profile.userId === signedInUser?.id) && <Button className='my-3' onClick={handleOnBioFormButtonClick}>Update Bio</Button>}
                    {isBioFormVisible && <UpdateBioForm profile={profile} updateProfile={updateProfile} />}
                </div>
            }
        </>
    )
}

Bio.propTypes = {
    profile: PropTypes.object.isRequired,
    toggleBioFormVis: PropTypes.func.isRequired,
    isBioFormVisible: PropTypes.bool.isRequired,
    updateProfile: PropTypes.func.isRequired
}

export default Bio;