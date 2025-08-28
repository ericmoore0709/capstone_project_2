import useCommunities from "../../../hooks/useCommunities";
import CommunityList from "../CommunityList";

const PublicCommunityList = () => {
    const { publicCommunities: communities } = useCommunities();

    return (
        <div>
            <h1>Public Communities</h1>
            <CommunityList communities={communities} />
        </div>
    );
}

PublicCommunityList.propTypes = {};

export default PublicCommunityList;