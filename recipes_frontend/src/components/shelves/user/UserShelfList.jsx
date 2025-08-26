import { CardGroup } from "reactstrap";
import useShelves from "../../../hooks/useShelves";
import Loading from "../../util/Loading";
import UserShelf from "./UserShelf";

const UserShelfList = () => {
    const { userShelves: shelves, loading } = useShelves();

    if (loading) return <Loading />

    return (
        <div>
            <h2 className='text-center mt-2'>My Shelves</h2>

            {/* Show message if there are no shelves to display */}
            {shelves.length === 0 && (
                <p className="text-center my-3">No shelves to display.</p>
            )}

            {/* Render shelves if available */}
            <CardGroup className='d-flex flex-wrap m-1'>
                {shelves.map((shelf) => (
                    <UserShelf
                        key={shelf.id}
                        shelf={shelf}
                    />
                ))}
            </CardGroup>
        </div>
    );
}

UserShelfList.propTypes = {};

export default UserShelfList;
