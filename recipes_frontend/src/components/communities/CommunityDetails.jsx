const CommunityDetails = ({ community }) => {
    return (
        <div>
            <h1>Community Details</h1>
            <p>Name: {community.name}</p>
            <p>Description: {community.description}</p>
            <p>Created by User ID: {community.creatorId}</p>
            {/* Add more community details as needed */}
        </div>
    );
}

CommunityDetails.propTypes = {};

export default CommunityDetails;