import React, { createContext } from "react";

export interface SelectedChat {
    user_id: string | undefined;
    friend_id?: string;
    group_id?: string;
    type: 'users' | 'groups';
}

export interface ChatContextType {
    selectedChat: SelectedChat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<SelectedChat | null>>;
    lastMessage: any;
    setLastMessage: React.Dispatch<React.SetStateAction<any>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export default ChatContext;
