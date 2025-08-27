import useCommunities from "../../hooks/useCommunities";

const CommunityList = () => {
    const { communities } = useCommunities();

    return (
        <div>
            <h1>Communities</h1>
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

CommunityList.propTypes = {};

export default CommunityList;