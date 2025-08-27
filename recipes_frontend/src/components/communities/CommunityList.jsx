import PropTypes from 'prop-types';

const CommunityList = ({ communities = [] }) => {
    return (
        <div>
            {communities.length === 0 ? (
                <p className="text-center my-3">No communities to display.</p>
            ) : (
                <ul>
                    {communities.map((community) => (
                        <li key={community.id}>{community.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

CommunityList.propTypes = {
    communities: PropTypes.array.isRequired
};

export default CommunityList;