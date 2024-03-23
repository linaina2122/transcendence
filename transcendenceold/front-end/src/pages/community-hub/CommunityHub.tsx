import React, { useEffect, useRef, useState } from "react";
import CardItem from "../../components/card-item/CardItem";
import "./CommunityHubStyle.css";
import { Link } from "react-router-dom";
import { useConnectedUser } from '../../context/ConnectedContext';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getTokensFromCookie, prepareUrl } from "../../utils/utils";
import Header from "../../components/Header/Header";

const CommunityHub: React.FC<any> = ({ type }) => {
  const itemsPerPage = 20;
  const [visibleItems, setVisibleItems] = useState<any>(itemsPerPage);
  const cardsContentRef = useRef(null);
  const [showEmptyCards, setShowEmptyCards] = useState<any>(false);
  const [total, setTotal] = useState<any>(0);
  const [data, setData] = useState<any>(null);
  const [value, setValue] = useState<any>(null);
  const { connectedUser } = useConnectedUser()
  const user_id = connectedUser?.id;
  const navigate = useNavigate();

  const fetchData = async () => {

    const tokens: any = await getTokensFromCookie();

    if (!tokens) {
        navigate("/notauth");
    }

    try {
        const response = await fetch(prepareUrl(`${type.slice(0, -1)}/all`), {
        method: "GET",
        headers: {
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
        },
        });
        const res = await response.json();
        if (res?.statusCode !== undefined){
          throw new Error('Try again, Later!')
        }

        setValue(res);
    } catch (error) {
        toast.error('Try again, Later!')
    }
}

  const handleBlockFriend = async (e: React.MouseEvent<HTMLAnchorElement>, friend_id: string) => {
    e.preventDefault();
      try {
        const tokens: any = await getTokensFromCookie();

        if (!tokens) {
            navigate("/notauth");
        }

            const response = await fetch(prepareUrl(`friend/block/${friend_id}`), {
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
            throw new Error('Try again, later!');
          }
      } catch (error) {
        toast.error('Try again, later!')
      }
  }

  const handlePlayGame = async (e: React.MouseEvent<HTMLAnchorElement>, friend_id: string) => {
    e.preventDefault();
      try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/notauth");
            }
            const response = await fetch(prepareUrl(`game/playwith/${friend_id}`), {
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
          navigate(`/game/${friend_id}`);
      } catch (error) {
        toast.error('An error occurred, Please try again.')
      }
  }

  useEffect(() => {

    if (connectedUser?.twoFactor && connectedUser?.towFactorToRedirect) {
      navigate("/tow-factor")
    }
    
    // setData(null)
    fetchData();
  }, [type])

  useEffect(() => {
    if (value) setData(value);
  }, [value]);

  const handleScroll = (event: any) => {
    if (type === "friends" && data?.friends?.length <= visibleItems) return;
    if (type === "rooms" && data?.groups?.length <= visibleItems) return;
    if (event.deltaY > 0 || event.key === "ArrowDown") {
      const scrolledToBottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight;

      if (scrolledToBottom) {
        setShowEmptyCards(true);
        setTimeout(() => {
          setVisibleItems(
            (prevVisibleItems: any) => prevVisibleItems + itemsPerPage
          );
          setShowEmptyCards(false);
        }, 2500);
      }
    }
  };

  useEffect(() => {
    if (showEmptyCards) {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleScroll);
      window.scrollTo(
        0,
        Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        )
      );
      return;
    } else {
      window.addEventListener("wheel", handleScroll);
      window.addEventListener("keydown", handleScroll);
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleScroll);
    };
  }, [showEmptyCards]);

  useEffect(() => {
    if (data) {
      if (type === "friends") setTotal(data?.friends?.length || 0);
      if (type === "rooms") setTotal(data?.groups?.length || 0);
    }
  }, [data]);

  const footerButtons = (id: string) => {
    switch (type) {
      case "friends":
        return [
          <li key={`friend-1-${id}`} className="card-button tooltip">
            <Link to={`/chat/${id}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  opacity="1"
                  d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">Chat</span>
          </li>,
          <li onClick={(e: any) => handlePlayGame(e, id)} key={`friend-2-${id}`} className="card-button tooltip">
            <Link to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path
                  opacity="1"
                  d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">Play</span>
          </li>,
          <li onClick={(e: any) => handleBlockFriend(e, id)} key={`friend-3-${id}`} className="card-button tooltip">
            <Link to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path
                  opacity="1"
                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">Block</span>
          </li>,
        ];
      case "rooms":
        return [];

      default:
        break;
    }
  };

  return (
    <>
    {/*<Header isConnected={true}  />*/}
    <section className="community-hub">
      <div className="container">
        <div className="community-hub-header">
          <div className="community-hub-title page-title">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
          <div className="community-hub-infos">
            <div className="community-hub-actions actions-buttons">
              {type === "rooms" && (
                <Link
                  to="/group/create"
                  className="action-button button-active"
                >
                  Create Group
                </Link>
              )}
            </div>
            <div className="community-hub-total">
              {total === 0
                ? ""
                : `${total} ${
                    type.charAt(0).toUpperCase() + type.slice(1, -1)
                  }`}
            </div>
          </div>
        </div>
        <div
          ref={cardsContentRef}
          className="cards-content"
          style={{ borderTop: "2px solid #a0a0a0" }}
        >

          {type === "friends" && data?.friends?.length === 0 && (
            <div className="empty-list">You have no friends yet</div>
          )}

          {type === "rooms" && data?.groups?.length === 0 && (
            <div className="empty-list">
              You are not a member of any group yet
            </div>
          )}

          {type === "friends" &&
            data?.friends
              ?.slice(0, visibleItems)
              .map((friend: any, index: number) => (
                <CardItem key={`key-friend-${index}`}
                  data={friend}
                  footerButtons={footerButtons(friend.id)}
                />
              ))}

          {type === "rooms" &&
            data?.groups
              ?.slice(0, visibleItems)
              .map((group: any, index: number) => (
                <CardItem key={`key-room-${index}`}
                  data={group}
                  footerButtons={footerButtons(group.id)}
                />
              ))}

          {(data?.groups?.length > 0 || data?.friends?.length > 0) &&
            showEmptyCards &&
            [1, 2, 3, 4].map((item, index) => <CardItem key={`key-empty-${index}`} data={undefined} footerButtons={undefined} />)}

          {/* {showEmptyCards && window.scrollTo(0, document.body.scrollHeight)} */}
        </div>
      </div>
    </section>
    </>
  );
};

export default CommunityHub;
