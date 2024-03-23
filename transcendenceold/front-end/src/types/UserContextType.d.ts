import { UserType } from "./UserType";

export interface UserContextType {
    user: UserType | null;
    fetchUser: () => Promise<void>;
    // getUser: React.Dispatch<React.SetStateAction<any>>;
}

export interface ConnectedUserContextType {
    connectedUser: UserType | null;
    setConnectedUser: (user: UserType) => Promise<void>;
    // getUser: React.Dispatch<React.SetStateAction<any>>;
}