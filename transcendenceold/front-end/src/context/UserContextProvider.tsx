import { useCallback, useEffect, useState } from "react";
import { UserType } from "../types";
import { getUserInfo } from "../utils/utils";
import { UserContext } from "./UserContext";

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ( { children } ) => {

    const [user, setUser] = useState< UserType | null>(null);

    const fetchUser = useCallback( async () => {

        const userData: UserType | null = await getUserInfo();

        if (userData) {
            setUser(userData)
        }
        
    }, [setUser]);
    
    return <UserContext.Provider value={{ user, fetchUser  }} > 
        { children }
    </UserContext.Provider>
}