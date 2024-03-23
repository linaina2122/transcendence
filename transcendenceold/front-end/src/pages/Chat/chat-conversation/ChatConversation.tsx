import React, { useContext, useEffect, useState } from "react";
import ChatConversationBody from "./chat-conversation-body/ChatConversationBody";
import ChatConversationHeader from "./chat-conversation-Header/ChatConversationHeader";
import ChatConversationFooter from "./chat-conversation-footer/ChatConversationFooter";
import NoConversaationSelected from "./no-conversation-selected/NoConversaationSelected";
import ChatContext from "../ChatContext";
import { SocketContext } from '../../../context/SocketProvider';
import { useConnectedUser } from '../../../context/ConnectedContext';
import { toast } from "react-toastify";
import "./ChatConversationStyle.css";



const ChatConversation: React.FC<any> = ({ chatMessages, conversationInfos, isBanned, isMuted, setChatData}) => {
  const { selectedChat, setSelectedChat, lastMessage, setLastMessage } = useContext(ChatContext) ?? {}; // TODO: more checks
  const socketData: any = useContext(SocketContext);
  const type = "person";
  const [messages, setMessages] = useState<any>(null);
  const [newMessages, setNewMessages] = useState<any>(null);
  const { connectedUser }: any = useConnectedUser()

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    // console.log('socketData ==>', socketData);

      // socketData?.on("requestGame", (newFriendData: any) => {
      //   MySwal.fire({
      //     title: "Do you want to play with this player?",
      //     showDenyButton: true,
      //     showCancelButton: false,
      //     confirmButtonText: "Yes",
      //     denyButtonText: 'No'
      // }).then((result: any) => {
      // /* Read more about isConfirmed, isDenied below */
      // if (result.isConfirmed) {
      //     console.log('OK')
      // } else if (result.isDenied) {
      //     console.log('NOT OK');
      // }
      // });
      // });

    socketData?.on("newMESSAGE", (newMessage: any) => {
      const data = {
        userType: newMessage.senderId === connectedUser?.id ? 'sender' : 'receiver', 
        username: newMessage.senderName, 
        timestamp: newMessage.timestamp, 
        message: newMessage.message, 
        image: newMessage.senderImage,
        senderId: newMessage.senderId,
        receiverId: newMessage?.receiverId,
        isRoom: newMessage.isRoom
      }
      setNewMessages(data);
      if (newMessage.isRoom){
        if (setLastMessage) {
          setLastMessage({message: data.message, groupId: newMessage.receiverId });
        }
      } else {
        if (setLastMessage) {
          setLastMessage({message: data.message, friendId: connectedUser?.id === newMessage.senderId ? newMessage.receiverId : newMessage.senderId  });
        }
      }
    });


    socketData?.on('newMESSAGE_ERROR', (newMessageError: any) => {
      
    });
  }, [socketData]) // hadi tzadt f v3

  useEffect(() => {
    const handleYouAreMuted = (roomWhereYouMuted: any) => {
      if (selectedChat?.group_id){
        if ((selectedChat?.group_id === roomWhereYouMuted?.roomId)) {
          setChatData((prevValue: any) => ({...prevValue, isMuted: true}))
          toast.info('You are muted in this room!');
        }
      }
    }

    const handleYouAreUnMuted = (roomWhereYouMuted: any) => {
      if (selectedChat?.group_id){
        if ((selectedChat?.group_id === roomWhereYouMuted?.roomId)) {
          setChatData((prevValue: any) => ({...prevValue, isMuted: false}))
          toast.info('You are unmuted in this room!');
        }
      }
    }
    socketData?.on('youAreMuted', handleYouAreMuted);
    socketData?.on('youAreUnMuted', handleYouAreUnMuted);

    return () => {
      socketData?.off('youAreMuted', handleYouAreMuted);
      socketData?.off('youAreUnMuted', handleYouAreUnMuted);
    };
  }, [selectedChat, socketData]);
  
  useEffect(() => {
    if (selectedChat && newMessages) {
      
      if (selectedChat?.friend_id){
        if ((selectedChat?.friend_id === newMessages?.senderId || selectedChat?.user_id === newMessages?.senderId) && newMessages.isRoom === false) handleMessage(newMessages);
      }
      if (selectedChat?.group_id){
        if ((selectedChat?.group_id === newMessages?.receiverId || selectedChat?.user_id === newMessages?.senderId) && newMessages.isRoom === true) handleMessage(newMessages);
      }
      }
  }, [newMessages]);

  const handleMessage = (data: any) => {
    setMessages((previousMessages: any) => {
      if (previousMessages) return [...previousMessages, data];
    });
  };


  return (
    <div
      className={`chat-conversation ${
        type === "person"
          ? "chat-conversation-person"
          : "chat-conversation-group"
      }`}
    >
      
      <div className="chat-conversation-content">
      {!selectedChat && <NoConversaationSelected message="No conversation has been selected yet" />}
      {selectedChat && (<><ChatConversationHeader conversationInfos={conversationInfos} selectedChat={selectedChat /* TODO: we romve this setSelectedChat={setSelectedChat} kant bara had l curly brackts*/} /> 
        <ChatConversationBody messages={messages} />
        {isMuted && <div className=" banned-muted-user">You are muted for the moment</div>}

        { ((!isBanned  && !isMuted) ) && <ChatConversationFooter handleMessage={handleMessage} />}</>)}
        
      </div>
    </div>
  );
};

export default ChatConversation;
