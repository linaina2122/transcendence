import { createContext, useContext } from "react";
import { ConnectedUserContextType  } from "../types";

const ConnectedContext = createContext<ConnectedUserContextType>({
    connectedUser: null,
    setConnectedUser: () => { return Promise.resolve(); },
});

const useConnectedUser = () => {
    return useContext(ConnectedContext);
}

export { useConnectedUser, ConnectedContext }
 
