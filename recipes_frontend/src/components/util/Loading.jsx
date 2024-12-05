import { Spinner } from "reactstrap";

const Loading = () => {
    return (
        <div className="d-flex flex-column align-items-center">
            <h2>Loading...</h2>
            <Spinner />
        </div>
    )
}


export default Loading;