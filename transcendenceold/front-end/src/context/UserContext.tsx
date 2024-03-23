import { createContext, useContext } from "react";
import { UserContextType, UserType } from "../types";

const UserContext = createContext<UserContextType>({
    user: null,
    fetchUser: () => { return Promise.resolve(); },
});

const useUser = () => {
    return useContext(UserContext);
}

export { useUser, UserContext }
 
