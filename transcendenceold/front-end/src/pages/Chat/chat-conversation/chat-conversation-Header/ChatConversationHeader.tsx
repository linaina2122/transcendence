import React, { useEffect, useRef, useState } from "react";
import useClickOutside from "../../../../utils/hooks/useClickOutside";
import "./ChatConversationHeaderStyle.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getTokensFromCookie, prepareUrl } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { Player } from "../../../Game/Game";
import { useConnectedUser } from "../../../../context/ConnectedContext";


interface ChatConversationHeaderProps {
  conversationInfos: any;
  selectedChat: any;
}

const ChatConversationHeader: React.FC<ChatConversationHeaderProps> = ({ conversationInfos, selectedChat }) => {
  const [justOpened, setJustOpened] = useState(false);
  const dropDownButtonRef = useRef<HTMLDivElement>(null);
  const dropDownMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { connectedUser, setConnectedUser } = useConnectedUser();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dropDownButton = dropDownButtonRef.current;
    if (dropDownButton) {
      dropDownButton.addEventListener("click", () => {
        setOpen(true);
        setJustOpened(true);
      });
    }
  }, [dropDownButtonRef]);
  
  const handlePlayGame = async () => {
    // e.preventDefault();
    if (selectedChat) {
      try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/notauth");
            }
            const response = await fetch(prepareUrl(`game/playwith/${selectedChat.friend_id}`), {
              method: "POST", 
              headers: {
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
              },
            });

          const res = await response.json();

          if (res?.statusCode !== 200) {
            throw new Error('An error occurred, Please try again.');
          }

          if (!response.ok){
            throw new Error('An error occurred, Please try again.');
          }
          console.log('PlayFriend: ', connectedUser?.id);
          Player.emit("PlayFriend", {userId: connectedUser?.id});
          navigate(`/game/${selectedChat?.friend_id}`);
      } catch (error) {
        toast.error('An error occurred, Please try again.')
      }
    }
  }

  const handleBlockFriend = async () => {
    // e.preventDefault();
    if (selectedChat) {
      try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/notauth");
            }
            const response = await fetch(prepareUrl(`friend/block/${selectedChat.friend_id}`), {
              method: "POST", 
              headers: {
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
              },
            });

          const res = await response.json();

          if (res?.statusCode !== undefined) {
            throw new Error('An error occurred, Please try again.');
          }

          if (!response.ok){
            throw new Error('An error occurred, Please try again.');
          }
      } catch (error) {
        toast.error('An error occurred, Please try again.')
      }
    }
  }


  useClickOutside(dropDownMenuRef, () => {
		// CHECK IF THE MODAL JUST OPENED
		if (justOpened) {
			setJustOpened(false);
			return;
		}

		if (open) setOpen(false);
	});

  useEffect(() => {
    //console.log('rendred ------------------------------------');
  });

  // return (
  //   <div>Chat conversation header</div>
  // )

  return (
    <div className="chat-conversation-header">
      <div className="chat-conversation-infos">
        <div className="chat-conversation-images">
          {conversationInfos?.images?.map((image: any, index: number) => (
            <img src={prepareUrl(image)} alt="member avatar" key={`key-${index}`} />
          ))}
        </div>
        <div className="chat-conversation-description">
          {conversationInfos?.type === "person" && (
            <>
              <div className="chat-conversation-name">
                {conversationInfos?.username}
              </div>
              <div
                className="chat-conversation-status"
                data-status={conversationInfos?.status?.toLowerCase()}
              >
                {conversationInfos?.status?.toLowerCase()}
              </div>
            </>
          )}
          {conversationInfos?.type === "group" && (
            <>
              <div className="chat-conversation-name">
                {conversationInfos?.name}
              </div>
              <div className="chat-conversation-members">
                members: {conversationInfos?.members}
              </div>
            </>
          )}
        </div>
      </div>
      {/* <div className="actions-buttons">
      {conversationInfos?.type === "person" && (<>
                <button type="button" className="action-button button-active">
                  Chat
                </button>
                <button type="button" className="action-button button-active">
                  Play
                </button>
                <button type="button" className="action-button button-inactive">
                  Block
                </button>
              </>)}
      {conversationInfos?.type === "group" && (
                <button type="button" className="action-button button-active">
                  Settings
                </button>
                
              )}
           


          </div> */}
      <div
        ref={dropDownButtonRef}
        className="chat-conversation-more dropdown-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512">
          <path
            opacity="1"
            d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"
          />
        </svg>
      </div>
      <div
        ref={dropDownMenuRef}
        className={`dropdown-menu ${open ? 'open' : ''}`}
      >
        <div className="dropdown-menu-content">
          <ul className="dropdown-list">
            {conversationInfos?.type === "person" && (
              <>
                <li className="dropdown-item">
                  <Link to={`/profile/${selectedChat.friend_id}`}>
                    <div className="dropdown-item-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path
                          opacity="1"
                          d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                        />
                      </svg>
                    </div>
                    <div className="dropdown-item-title">Profile</div>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link onClick={(e) => {
                    handlePlayGame();
                  } } to={""}>
                    <div className="dropdown-item-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512"
                      >
                        <path
                          opacity="1"
                          d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                        />
                      </svg>
                    </div>
                    <div className="dropdown-item-title">Play Game</div>
                  </Link>
                </li>
                <li className="dropdown-item" id="block">
                  <Link onClick={(e) => {
                    handleBlockFriend();
                  } } to={""}>
                    <div className="dropdown-item-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path
                          opacity="1"
                          d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
                        />
                      </svg>
                    </div>
                    <div className="dropdown-item-title">block</div>
                  </Link>
                </li>
              </>
            )}
            {conversationInfos?.type === "group" && (
              <li className="dropdown-item">
                <Link to={`/group/${conversationInfos.id}`}>
                  <div className="dropdown-item-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        opacity="1"
                        d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
                      />
                    </svg>
                  </div>
                  <div className="dropdown-item-title">Settings</div>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChatConversationHeader;
