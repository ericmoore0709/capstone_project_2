import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardImg, CardText, CardTitle } from 'reactstrap';
import AdminControls from './card/AdminControls';
import Metadata from './card/Metadata';
import useAuth from '../../hooks/useAuth';
import useCommunities from '../../hooks/useCommunities';

const CommunityCard = ({ community }) => {
    const { signedInUser } = useAuth();
    const defaultImage = "https://www.dummyimage.com/640x4:3/";
    const { deleteCommunity } = useCommunities();

    const deletionConfirmed = (msg) => {
        return window.confirm(msg);
    }

    const handleOnDelete = (id) => {
        if (deletionConfirmed('Are you sure you want to delete this community?')) {
            deleteCommunity(id);
        }
    }

    return (
        <div className='p-2 d-flex'>
            <Card style={{ minWidth: '200px', minHeight: '250px', width: '23vw' }}>
                <Link to={`/communities/${community.id}`}><CardImg src={community.image || defaultImage} alt={community.name} style={{ maxHeight: '150px', objectFit: 'cover' }} /></Link>

                <CardBody className='d-flex flex-column'>
                    <CardTitle tag='h5' className='text-center'><Link to={`/communities/${community.id}`}>{community.name}</Link></CardTitle>
                    <CardText className='text-truncate' style={{ maxHeight: '3em', overflow: 'hidden' }}>{community.description}</CardText>
                </CardBody>

                {community.admin && <>
                    {/* Meta Info*/}
                    <Metadata community={community} />
                    {/* Author controls */}
                    {(community.admin_id === signedInUser.id) && <AdminControls communityId={community.id} handleOnDelete={handleOnDelete} />}
                </>}
            </Card>
        </div>
    );
}

CommunityCard.propTypes = {
    community: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        imageUrl: PropTypes.string,
        adminId: PropTypes.number.isRequired,
    }).isRequired,
};

export default CommunityCard;