import { Alert } from "reactstrap";
import useNotification from "../../hooks/useNotification";

const ClientNotification = () => {
    const { clientMessage, clientMessageXClicked } = useNotification();

    return (<Alert
        color={clientMessage.color}
        isOpen={(clientMessage.message !== "")}
        toggle={clientMessageXClicked}>
        {clientMessage.message}
    </Alert>);
}

export default ClientNotification;