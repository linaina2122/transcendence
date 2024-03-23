import { useContext } from "react";
import ChatTypeBlock from "./chat-type-block/ChatTypeBlock";
import ChatContext from "../ChatContext";
import "./ChatSidebarStyle.css";

interface SelectedChat {
  user_id: string | undefined;
  friend_id?: string;
  group_id?: string;
  type: 'users' | 'groups';
}

interface ChatContextType {
  selectedChat: SelectedChat | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<SelectedChat | null>>;
  lastMessage: any;
  setLastMessage: React.Dispatch<React.SetStateAction<any>>;
}

const ChatSidebar: React.FC = () => {
  const { selectedChat, setSelectedChat, lastMessage, setLastMessage } = useContext(ChatContext) as ChatContextType;

  return (
    <div className="chat-sidebar">
      <ChatTypeBlock
        type={"chat-friends"}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        lastMessage={lastMessage}
        setLastMessage={setLastMessage}
      />
      <ChatTypeBlock
        type={"chat-groups"}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        lastMessage={lastMessage}
        setLastMessage={setLastMessage}
      />
    </div>
  );
};

export default ChatSidebar;
