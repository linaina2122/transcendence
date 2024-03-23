import "./RoleStyle.css";
import "../membership-requests/MembershipRequestsStyle.css";
import CardItem from "../../../components/card-item/CardItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useConnectedUser } from '../../../context/ConnectedContext';
import { toast } from "react-toastify";
import { getTokensFromCookie, prepareUrl } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";



const Role: React.FC<any> = ({ data, setData }) => {
  const { connectedUser } = useConnectedUser()
  const type = data?.type;
  const infos: any = data?.infos;
  const userType = data?.userType;
  const group_id = data?.group_id;
  const user_id = connectedUser?.id;
  const friendsList = data?.friends_list; 
  const navigate = useNavigate();


  const [owner, setOwner] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (type === 'owner') setOwner(infos);
    if (type === 'admins') {
      setAdmins(infos)
    };
    if (type === 'members') {
      setMembers(infos);}
  }, [data, owner, admins, members])

  const handleMute = async (user_id: any, mutedUser: any, type: any) => {
    if (!window.confirm('Are you sure you want to mute had bnadm?')) return;
    try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/notauth");
            }
            const response = await fetch(prepareUrl(`room/${group_id}/mute`), {
              method: "POST",
              body: JSON.stringify({ userId: mutedUser, roomId: group_id,  duration: 1}),
              headers: {
                "Content-Type": "application/json",
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
              },
            });

            const res = await response.json();
            if (res?.statusCode !== undefined) {
              throw new Error('Try again later!');
            }
            if (!response.ok){
              throw new Error('Try again later!');
            }
            setData((prevValue: any) => {
              return {
                  banned_members: prevValue?.banned_members,
                  members : type === 'members' ? prevValue?.members.filter((item: any) => item.id !== res.id) : prevValue?.members,
                  members_requests: prevValue?.members_requests,
                  type: prevValue?.type, 
                  name: prevValue?.name,
                  owner: prevValue?.owner, 
                  admins: prevValue?.admins,
                  muted_members: [...prevValue?.muted_members, res],
                  friends_list: prevValue?.friends_list
            }
            });
            toast.success('The member muted successfully!');
    } catch (error) {
      toast.error('Try again later!')
    }
  }

  const handleBan = async (user_id: any, bannedId: any, type: any) => {
    if (!window.confirm('Are you sure you want to set had khona?')) return; 
    try {
              const tokens: any = await getTokensFromCookie();

              if (!tokens) {
                  navigate("/notauth");
              }
              const response = await fetch(prepareUrl(`room/${group_id}/ban`), {
              method: "POST",
              body: JSON.stringify({ adminId: user_id, roomId: group_id, bannedId: bannedId }),
              headers: {
                "Content-Type": "application/json",
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
              },
            });
            const res = await response.json();
            if (res?.statusCode !== undefined) {
              throw new Error('Try again later!');
            }
            if (!response.ok){
              throw new Error('Try again later!');
            }
            if (res) {
              setData((prevValue: any) => {
                return {
                    banned_members: [...prevValue?.banned_members, res],
                    members : type === 'members' ? prevValue?.members.filter((item: any) => item.id !== res.id) : prevValue?.members,
                    members_requests: prevValue?.members_requests,
                    type: prevValue?.type, 
                    name: prevValue?.name,
                    owner: prevValue?.owner, 
                    admins: type === 'admins' ? prevValue?.admins.filter((item: any) => item.id !== res.id) : prevValue?.admins,
                    muted_members: prevValue?.muted_members,
                    friends_list: prevValue?.friends_list
              }
              });
              toast.success('The member is banned successfully!');
            };
    } catch (error) {
      toast.error('Try again later!')
    }
  }

  const handleSetAmin = async (user_id: any, newAdmin: any) => {
      if (!window.confirm('Are you sure you want to set had bnadm as admin?')) return; 
      try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/notauth");
            }
            const response = await fetch(prepareUrl(`room/${group_id}/setAdmin`), {
            method: "POST",
            body: JSON.stringify({ adminId: user_id, roomId: group_id, newAdmin: newAdmin }),
            headers: {
              "Content-Type": "application/json",
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
            },
          });
          const res = await response.json();
          if (res?.statusCode !== undefined) {
            throw new Error('Try again later!');
          }
          if (!response.ok){
            throw new Error('Try again later!');
          }
          if (res) {
                setData((prevValue: any) => {
                  return {
                  banned_members: prevValue?.banned_members,
                  members : prevValue?.members.filter((item: any) => item.id !== res.id),
                  members_requests: prevValue?.members_requests,
                  type: prevValue?.type, 
                  name: prevValue?.name,
                  owner: prevValue?.owner, 
                  admins:[...prevValue?.admins, res],
                  muted_members: prevValue?.muted_members,
                  friends_list: prevValue?.friends_list
                }
                });
                toast.success('The member setted as admin successfully!');
            };
      } catch (error) {
        toast.error('Try again later!')
      }
      
  }

  const handleUnsetAdmin = async (user_id: any, unsetAdminId: any) => {
    if (!window.confirm('Are you sure you want to set had bnadm as admin?')) return;
      try {
              const tokens: any = await getTokensFromCookie();

              if (!tokens) {
                  navigate("/notauth");
              }
              const response = await fetch(prepareUrl(`room/${group_id}/unsetAdmin`), {
              method: "POST",
              body: JSON.stringify({ adminId: user_id, roomId: group_id, unsetAdmin: unsetAdminId }),
              headers: {
                "Content-Type": "application/json",
                'access_token': tokens.access_token,
                'refresh_token': tokens.refresh_token
              },
          });
          const res = await response.json();
          if (res?.statusCode !== undefined) {
            throw new Error('Try again later!');
          }
          if (!response.ok){
            throw new Error('Try again later!');
          }
          if (res) {
                setData((prevValue: any) => {
                  return {
                    banned_members: prevValue?.banned_members,
                    members : [...prevValue?.members, res],
                    members_requests: prevValue?.members_requests,
                    type: prevValue?.type, 
                    name: prevValue?.name,
                    owner: prevValue?.owner, 
                    admins:prevValue?.admins.filter((item: any) => item.id !== res.id),
                    muted_members: prevValue?.muted_members,
                    friends_list: prevValue?.friends_list
                }
                });
                toast.success('The member setted as admin successfully!');
            };
      } catch (error) {
        toast.error('Try again later!')
      }
  }

  const handleKick = async (user_id: any, kickedUser: any) => {
      if (!window.confirm('Are you sure you want to delete had bnadm?')) return; 
      try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/notauth");
            }
            const response = await fetch(prepareUrl(`room/${group_id}/kick`), {
            method: "POST",
            body: JSON.stringify({ adminId: user_id, roomId: group_id, userId: kickedUser }),
            headers: {
              "Content-Type": "application/json",
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
            },
          });
          const res = await response.json();
          if (res?.statusCode !== undefined) {
            throw new Error('Try again later!');
          }
          if (!response.ok){
            throw new Error('Try again later!');
          }
          if (res) {
            setData((prevValue: any) => {
              return {
                banned_members: prevValue?.banned_members,
                members : type === 'members' ? prevValue?.members.filter((item: any) => item.id !== res.id) : prevValue?.members,
                members_requests: prevValue?.members_requests,
                type: prevValue?.type, 
                name: prevValue?.name,
                owner: prevValue?.owner, 
                admins: type === 'admins' ? prevValue?.admins.filter((item: any) => item.id !== res.id) : prevValue?.admins,
                muted_members: prevValue?.muted_members,
                friends_list: prevValue?.friends_list
            }
          })
        };
      } catch (error) {
        toast.error('Try again later!')
      }
  }

  const footerButtons = (type: string, id: string) => {

    switch (type) {
      case "owner":
        if (userType === 'visitor'|| userType === 'member' || userType === 'admin') {

          if (id === user_id) return;

          if(friendsList === undefined || friendsList?.indexOf(id) === -1) return; 

          return [
            <li key={`owner-1-${id}`} className="card-button tooltip">
            <Link to={`/`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path opacity="1" d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
            </Link>
            <span className="tooltiptext">Play</span>
          </li>,
            <li key={`owner-2-${id}`} className="card-button tooltip">
            <Link to={`/chat/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path opacity="1" d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"/></svg>
            </Link>
            <span className="tooltiptext">Chat</span>
          </li>,
          ];
        }
        
        return;
      case "admins":
        if (userType === 'visitor' || userType === 'member' || userType === 'admin') {
          // CHECK OUT IF IT IS USER'S CARD 
          if (id === user_id) return;

          // CHECK OUT IF IT IS NOT A FRIEND DO NOT SHOW TO THE USER THE FOOTER
          if(friendsList === undefined || friendsList?.indexOf(id) === -1) return; 

          return [
            <li key={`admins-1-${id}`} className="card-button tooltip">
            <Link to={`/`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path opacity="1" d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
            </Link>
            <span className="tooltiptext">Play</span>
          </li>,
            <li key={`admins-2-${id}`} className="card-button tooltip">
            <Link to={`/chat/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path opacity="1" d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"/></svg>
            </Link>
            <span className="tooltiptext">Chat</span>
          </li>,
          ];
        }
        return [
          <li
            onClick={(e) => {
              handleUnsetAdmin(user_id, id);
            }}
            key={`admins-1-${id}`}
            className="card-button tooltip"
          >
            <Link to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM472 200H616c13.3 0 24 10.7 24 24s-10.7 24-24 24H472c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
              </svg>
            </Link>
            <span className="tooltiptext">unset admin</span>
          </li>,
          <li onClick={() => handleMute(user_id, id, type)} key={`admins-2-${id}`} className="card-button tooltip">
            <Link onClick={(e) => e.preventDefault()} to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path
                  opacity="1"
                  d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM96 75V64H288V75c0 19-5.6 37.4-16 53H112c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9H112z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">mu1e</span>
          </li>,
          <li onClick={() => handleBan(user_id, id,type)} key={`admins-3-${id}`} className="card-button tooltip">
            <Link onClick={(e) => e.preventDefault()} to={""} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  opacity="1"
                  d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">ban</span>
          </li>,
          <li onClick={(e) => {
            handleKick(user_id, id); // TODO: we remove infos?.id, more checks
            }}key={`admins-4-${id}`} className="card-button tooltip">
            <Link onClick={(e) => e.preventDefault()} to={""}> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path
                  opacity="1"
                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">kick B</span>
          </li>,
        ];
      case "members":

        if (userType === 'visitor' || userType === 'member') {
          // CHECK OUT IF IT IS USER'S CARD 
          if (id === user_id) return;

          // CHECK OUT IF IT IS NOT A FRIEND DO NOT SHOW TO THE USER THE FOOTER
          if(friendsList === undefined || friendsList?.indexOf(id) === -1)  return; 

          return [
            <li key={`members-1-${id}`} className="card-button tooltip">
            <Link to={`/`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path opacity="1" d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
            </Link>
            <span className="tooltiptext">Play</span>
          </li>,
            <li key={`members-2-${id}`} className="card-button tooltip">
            <Link to={`/chat/${id}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path opacity="1" d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"/></svg>
            </Link>
            <span className="tooltiptext">Chat</span>
          </li>,
          ];
        }
        return [
          <li onClick={(e) => {
            handleSetAmin(user_id, id); // TODO: we remove infos?.id, more checks
            }} key={`members-1-${id}`} className="card-button tooltip">
            <Link to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path
                  opacity="1"
                  d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7H162.5c0 0 0 0 .1 0H168 280h5.5c0 0 0 0 .1 0H417.3c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2H224 204.3c-12.4 0-20.1 13.6-13.7 24.2z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">set admin</span>
          </li>,
          <li onClick={() => handleMute(user_id, id, type)} key={`members-2-${id}`} className="card-button tooltip">
            <Link onClick={(e) => e.preventDefault()} to={""}> 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path
                  opacity="1"
                  d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM96 75V64H288V75c0 19-5.6 37.4-16 53H112c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9H112z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">mute</span>
          </li>,
          <li onClick={() => handleBan(user_id, id, type)} key={`members-3-${id}`} className="card-button tooltip">
            <Link onClick={(e) => e.preventDefault()} to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  opacity="1"
                  d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">ban</span>
          </li>,
          <li onClick={(e) => {
            handleKick(user_id, id); // TODO: we remove infos?.id, more checks
            }} key={`members-4-${id}`} className="card-button tooltip">
            <Link onClick={(e) => e.preventDefault()} to={""}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                <path
                  opacity="1"
                  d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
                />
              </svg>
            </Link>
            <span className="tooltiptext">kick A</span>
          </li>,
        ];

      default:
        return [];
    }
  };

  let length = 0;
  return (
    <section className="role">
      <div className="role-title">{type}</div>
      <div
        className={`${
          type === "admins"
            ? "admins-role admins-role-cards"
            : type === "members"
            ? "members-role"
            : ""
        }`}
      >
        <div
          className={`cards-content ${
            type === "admins"
              ? "scrollbar"
              : type === "members"
              ? "members-role-cards cards-content scrollbar"
              : ""
          }`}
        >
          {owner?.length > 0 &&
            (length = owner?.length) &&
            owner?.map((info: any, index) => (
              <CardItem key={`key-${index}`} data={info} footerButtons={footerButtons(type, info.id)} />
            ))}
          {admins?.length > 0 &&
            (length = admins?.length) &&
            admins?.map((admin: any, index) => (
              <CardItem key={`key-${index}`} data={admin} footerButtons={footerButtons(type, admin.id)} />
            ))}
          {members?.length > 0 &&
            (length = members?.length) &&
            members?.map((member: any, index) => (
              <CardItem key={`key-${index}`} data={member} footerButtons={footerButtons(type, member.id)} />
            ))}
          {(length === 0)  && (
  <div className="empty-content" style={{ gridTemplateColumns: type === 'admins' ? '1 span 2' : '' }}>
    No {type} in this room!
  </div>
)}

        </div>
      </div>
    </section>
  );
};

export default Role;
