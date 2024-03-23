import React from "react";
import "./ChatItem.css";
// import ConnectedContext from "../../../../../ConnectedContext";
import { useConnectedUser } from '../../../../../context/ConnectedContext';
import { Link } from "react-router-dom";
import { prepareUrl } from "../../../../../utils/utils";




const ChatItem : React.FC<any> = ({
  data,
  type, 
  selectedChat,
  setSelectedChat,
  lastText
}) => {

const { connectedUser }: any = useConnectedUser()
  const user_id = connectedUser?.id;



if (type === "friend" && data.friend) {
  const { id, status, friend, notifications } = data;
  if (lastText !== '') friend.message = lastText
    return (
      <li
        className="chat-item"
        data-status={status}
        onClick={(e) =>
          {
            e.preventDefault();
            setSelectedChat({
            user_id: user_id,
            friend_id: id,
            type: "users",
          })
          const target = e.target as HTMLElement;
          target.classList.add('active');
        }
        }
      >
        <Link onClick={(e) => e.preventDefault()} to={""}>
          <div className="friend-infos chat-item-infos">
            <div className="friend-img chat-item-images">
              <img src={prepareUrl(friend?.image)} alt="member-avatar" />
            </div>
            <div className="friend-description chat-item-description">
              <div className="chat-item-title">{friend?.name}</div>
              <p className="chat-item-message">{friend?.message}</p>
            </div>
          </div>
        </Link>
      </li>
    );
  }

  if (type === "group" && data.group) {
    const { id, members, group, notifications } = data;
  if (lastText !== '') group.message = lastText
    return (
      <li
        className="chat-item"
        onClick={() =>
          setSelectedChat({
            user_id: user_id,
            group_id: id,
            type: "groups",
          })
        }
      >
        <Link to={""}>
          <div className="group-infos chat-item-infos">
            <div className="group-img chat-item-images">
              {group.images.map((image: any, index: number) => {
                return <img key={`key-` + index} src={prepareUrl(image)} alt="member avatar" />
              }
              )}
            </div>
            <div className="group-description chat-item-description">
              <div className="chat-item-title">{group.name}</div>
              <p className="chat-item-message">{group.message}</p>
            </div>
          </div>
        </Link>
      </li>
    );
  }

  return null;
};

export default ChatItem;
