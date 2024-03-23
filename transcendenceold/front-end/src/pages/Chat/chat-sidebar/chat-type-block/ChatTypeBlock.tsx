import React, { useContext, useEffect, useState } from "react";
import "./ChatTypeBlockStyle.css";
import ChatItem from "./chat-item/ChatItem";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getTokensFromCookie, prepareUrl } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useConnectedUser } from '../../../../context/ConnectedContext';
import { SocketContext } from '../../../../context/SocketProvider';


interface CloseSelectedChat {
  id: string;
  payload?: {
    roomId: string;
  };
}

const ChatTypeBlock: React.FC<any> = ({ type, selectedChat, setSelectedChat, lastMessage,setLastMessage }) => {

  const [friendsMessages, setFriendsMessages] = useState([]);
  const [groupsMessages, setgroupsMessages] = useState([]);
  const [newFriend, setNewFriend] = useState(null);
  const [newGroup, setNewGroup] = useState(null);
  const socketData: any = useContext(SocketContext);
  const { connectedUser }: any = useConnectedUser()
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const tokens: any = await getTokensFromCookie();
      if (!tokens) {
        navigate("/notauth");
      }
      if (type == 'chat-friends') {
        const response = await fetch(prepareUrl(`messages/conversation/me`),{
          method: "GET",
          headers: {
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
          },
          });
          if (!response.ok){
            throw new Error('Try again, later!');
          }
        const data = await response.json();
        if (data?.statusCode !== undefined){
            throw new Error('Try again, Later!');
        }
        const transformedData = data.map((item: any) => ({
          id: item.user.id,
          status: (item.user.status).toLowerCase(),
          friend: {
            name: item.user.username,
            image: item.user.avatarUrl,
            message: item?.lastMessage?.message ? item?.lastMessage?.message : 'start conversation',
            notifications: item.unreadCount,
          },
          notifications: item.unreadCount
        }));
        
        setFriendsMessages(transformedData);
      }
      if (type == 'chat-groups') {
        const responseGroup = await fetch(prepareUrl(`room/all/conv`), {
          method: "GET",
          headers: {
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
          },
          });
        if (!responseGroup.ok){
          throw new Error('Try again, later!');
        }
        const dataGroup = await responseGroup.json();
        if (dataGroup?.statusCode !== undefined){
          throw new Error('Try again, Later!');
        }  
        const transformedDataGroup = dataGroup.map((item: any) => ({
          "id": item.id,
          "members": item.members,
          "group": {
            "name": item.roomName,
            "images": item.group.images,
            "message": item.group.lastMessage
          },
        }));
        setgroupsMessages(transformedDataGroup);
      }
    } catch (error) {
      toast.error('Try again, later!')
    }
  };

  useEffect(() => {
    fetchData();

    socketData?.on("newFriend", (newFriendData: any) => {
      setNewFriend(newFriendData)
    });

    socketData?.on("removeFriend", (removedFriendData: any) => {
      if (removedFriendData) {
        setFriendsMessages((prevValue: any) => prevValue.filter((item: any) => item.id !== removedFriendData?.id))
        setCloseSelectedChat(removedFriendData);
      };
    });

    socketData?.on("leaveRoom", (removedRoomData: any) => {
        setgroupsMessages((prevValue: any) => prevValue.filter((item: any) => item.id !== removedRoomData?.payload?.roomId))
        setCloseSelectedChat(removedRoomData);
    });

    socketData?.on("newRoom", (newRoomData: any) => {
      if (newRoomData) {
        setNewGroup(newRoomData)
      };
    });
  }, [connectedUser, socketData]); // socketData tzadt f v3

  const [closeSelectedChat, setCloseSelectedChat] = useState<CloseSelectedChat | null>(null);
  
  useEffect(() => {
    if (closeSelectedChat && selectedChat) {
      if (selectedChat?.group_id === closeSelectedChat?.payload?.roomId) {
        setSelectedChat(null)
      } else if (selectedChat?.friend_id === closeSelectedChat?.payload?.roomId) {
        setSelectedChat(null)
      }
    }
  }, [closeSelectedChat]);

  useEffect(() => {
    // fetchData();
    if (newFriend) setFriendsMessages((prevValue) => [...prevValue, newFriend]);
  }, [newFriend]);

  useEffect(() => {
    if (newGroup) setgroupsMessages((prevValue) => [...prevValue, newGroup]);
  }, [newGroup]);



  const [lastText, setLastText] = useState('');
  useEffect(()=> {
    if (lastMessage && lastMessage?.friendId) setLastText(lastMessage?.message)
    if (lastMessage && lastMessage?.groupId) setLastText(lastMessage?.message)
  
  }, [lastMessage, selectedChat]);



  if (type === "chat-friends") {
    return (
      <div className="chat-friends chat-sidebar-item">
        <div className="chat-sidebar-item-header">
          <div className="chat-title">Friends</div>
          <Link to='/friends'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path opacity="1" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg> See all
          </Link>
          <Link to='/friends' className='friends-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path opacity="1" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"/></svg>
          </Link>
        </div>
        <ul className="chat-list scrollbar">
          {friendsMessages &&
            friendsMessages?.map((friendMessage: any, index) => {
              const key = `key-${index}`;
              return (
                <ChatItem
                  data={friendMessage}
                  type="friend"
                  key={key}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  lastText={friendMessage.id === lastMessage?.friendId ? lastText : 'start conversation'}
                />
              );
            })}
        </ul>
      </div>
    );
  }
  if (type === "chat-groups") {
    return (
      <div className="chat-groups chat-sidebar-item">
        <div className="chat-sidebar-item-header">
          <div className="chat-title">Groups</div>
          <Link to='/groups'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path opacity="1" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg> See all
          </Link>
          <Link to='/groups' className='groups-icon'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
          </Link>
        </div>
        <ul className="chat-list scrollbar">
          {groupsMessages &&
            groupsMessages?.map((groupMessage: any, index) => {
              const key = `key-${index}`;
              return (
                <ChatItem
                  data={groupMessage}
                  type="group"
                  key={key}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  lastText={groupMessage.id === lastMessage?.groupId ? lastText : ''}
                />
              );
            })}
        </ul>
      </div>
    );
  }
  return null;
};

export default ChatTypeBlock;
