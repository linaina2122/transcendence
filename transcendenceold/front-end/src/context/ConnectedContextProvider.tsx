import { createContext, useEffect, useState } from "react";
import useLocalStorage from "../utils/hooks/useLocalStorage";
import { ConnectedContext } from "./ConnectedContext";
import { UserType } from "../types";
import { getCookie, getUserInfo } from "../utils/utils";

interface UserProviderProps {
  children: React.ReactNode;
}


export const ConnectedProvider: React.FC<UserProviderProps> = ({ children }) => {

  const [ connectedUser, setConnectedUser] = useLocalStorage("connected-user", {});

  
  // IF THE JWT CONTAINS JUST THE ID, NOT ALL THE USER DATA
  useEffect(() => {
    initData();
  }, [setConnectedUser])

  const initData = async () => {

    const gat = getCookie('access_token');
    const grt = getCookie('refresh_token');

      if (gat && grt) {
        
        const userData: UserType | null = await getUserInfo();
    
        if (userData) {
          setConnectedUser(userData)
        }
        
      }


  }

  return (
    <ConnectedContext.Provider value={{ connectedUser, setConnectedUser }}>
      {children}
    </ConnectedContext.Provider>
  );
}

export default ConnectedProvider;
