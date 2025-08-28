import PropTypes from 'prop-types';
import CommunityCard from './CommunityCard';
import { CardGroup } from 'reactstrap';

const CommunityList = ({ communities = [] }) => {
    return (
        <div>
            {communities.length === 0 ? (
                <p className="text-center my-3">No communities to display.</p>
            ) : (
                <CardGroup className='d-flex flex-wrap m-1 w-100 justify-content-center'>
                    {communities.map((community) => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                        />
                    ))}
                </CardGroup>
            )}
        </div>
    );
}

CommunityList.propTypes = {
    communities: PropTypes.array.isRequired
};

export default CommunityList;