import React, { useContext, useEffect, useRef, useState } from "react";
import "./ChatConversationFooterStyle.css";
import ChatContext, { ChatContextType } from "../../ChatContext";
import { useConnectedUser } from '../../../../context/ConnectedContext';
import { SocketContext } from '../../../../context/SocketProvider';

interface ChatConversationFooterProps {
  handleMessage: (data: any) => void; // Define the type of handleMessage if possible
}

const ChatConversationFooter: React.FC<ChatConversationFooterProps> = ({ handleMessage }) => {
  const { selectedChat, setSelectedChat } = useContext(ChatContext) as ChatContextType;
  const socketData: any = useContext(SocketContext);
  const [textMessage, setTextMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { connectedUser } = useConnectedUser()

  const handleSendMessage = (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText === "") return;
    setTextMessage(trimmedText);

    socketData.emit('sendMESSAGE', {
      senderId: connectedUser?.id,
      senderName: connectedUser?.username,
      receiverId: selectedChat?.friend_id || selectedChat?.group_id,
      readed: false,
      message: textMessage,
      isRoom: selectedChat?.type === "users" ? false : true
  })

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  };

  return (
    <div className="chat-conversation-footer">
      <div className="chat-conversation-footer-icon"></div>
      <textarea
        ref={textareaRef}
        name="chat-conversation-footer-input"
        id=""
        className="chat-conversation-footer-input scrollbar"
        placeholder="Enter you message here"
        onChange={(e) => setTextMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage((e.target as HTMLTextAreaElement).value);
          }
        }}
      />

      <button
        type="button"
        onClick={(e) => {
          if (textareaRef.current) {
            handleSendMessage(textareaRef.current.value)}
          }
        }
        className="button"
      >
        Send <i className="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  );
};

export default ChatConversationFooter;
