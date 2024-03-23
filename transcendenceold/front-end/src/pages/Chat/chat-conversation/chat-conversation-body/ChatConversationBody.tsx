import React, { useLayoutEffect, useRef } from "react";
import "./ChatConversationBodyStyle.css";
import ChatMessage from "./chat-message/ChatMessage";
import NoConversaationSelected from "../no-conversation-selected/NoConversaationSelected";

const ChatConversationBody: React.FC<any> = ({ messages }) => {
  
  const chatConversationBodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const chatConversationBody = chatConversationBodyRef.current;
    if (chatConversationBody) {
      chatConversationBody.scrollTo(0, chatConversationBody.scrollHeight);
    }
  }, [messages]);

  return (
    <div
      ref={chatConversationBodyRef}
      className="chat-conversation-body scrollbar"
    >
      {messages?.length ? (
        messages?.map((message: any, index: number) => {
          const key = `message-${index}`;
          return <ChatMessage key={key} data={message} />;
        })
      ) : (
        <NoConversaationSelected message="This conversation is empty" />
      )}
    </div>
  );
};

export default ChatConversationBody;
