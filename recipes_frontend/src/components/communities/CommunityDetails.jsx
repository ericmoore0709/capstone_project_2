import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../util/Loading";
import { Alert } from "reactstrap";
import useCommunities from "../../hooks/useCommunities";

const CommunityDetails = () => {
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getCommunityById } = useCommunities();
    const defaultImage = "https://www.dummyimage.com/640x4:3/";

    useEffect(() => {
        const fetchCommunity = async (id) => {
            setIsLoading(true);
            setError(null);

            try {
                const fetchedCommunity = await getCommunityById(id);
                setCommunity(fetchedCommunity || null);
            } catch (err) {
                console.error("Error fetching community:", err);
                setError("Failed to load community details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCommunity(id);
    }, [id, getCommunityById]);

    return (
        <div className="container mt-4">
            {isLoading && <Loading />}
            {error && <Alert color="danger" className="text-center">{error}</Alert>}
            {(community && !error) && (
                <>
                    <h1 className="text-center">{community.name}</h1>
                    <p className="text-muted text-center">{community.description}</p>

                    <div className="text-center my-3">
                        <img src={community.image || defaultImage} alt={`${community.name} image`} className="img-fluid rounded w-25" />
                    </div>
                </>
            )}
            {(!isLoading && !community) && <h2 className="text-center my-4">Community Not Found</h2>}
        </div >
    );
}

CommunityDetails.propTypes = {};

export default CommunityDetails;