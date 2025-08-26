import { useState } from "react";
import NotificationContext from "../contexts/NotificationContext";

const NotificationProvider = ({ children }) => {
    const [clientMessage, setClientMessage] = useState({ color: 'info', message: '' });

    /**
   * Closes the client message alert
   */
    const clientMessageXClicked = () => {
        setClientMessage({ color: 'info', message: '' });
    }

    return (
        <NotificationContext.Provider value={{ clientMessage, setClientMessage, clientMessageXClicked }}>
            {children}
        </NotificationContext.Provider>
    );
}

export default NotificationProvider;