import useCommunities from "../../../hooks/useCommunities";
import CommunityList from "../CommunityList";

const UserCommunityList = () => {
    const { userCommunities: communities } = useCommunities();

    return (
        <div>
            <h1>My Communities</h1>
            <CommunityList communities={communities} />
        </div>
    );
}

UserCommunityList.propTypes = {};

export default UserCommunityList;