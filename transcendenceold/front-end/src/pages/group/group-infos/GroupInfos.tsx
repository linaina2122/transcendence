import { useRef } from "react";
import "./GroupInfosStyle.css";
import { useNavigate  } from "react-router-dom";
import { useConnectedUser } from '../../../context/ConnectedContext';
import { toast } from "react-toastify";
import { getTokensFromCookie, prepareUrl } from "../../../utils/utils";

interface GroupInfosProps {
  groupInfos: {
    id: string;
    name: string;
    type: string;
    userType: string;
    banned_members: Array<{id: string, name: string, status: string | undefined, images: string[]}>;
    muted_members: Array<{id: string, name: string, status: string | undefined, images: string[]}>;
  };
  members_requests: any;
}


const GroupInfos: React.FC<GroupInfosProps> = ({ groupInfos, members_requests }) => {
  const navigate = useNavigate();
  const joinGroupPasswordRef = useRef<HTMLInputElement>(null);

  const { connectedUser } = useConnectedUser()
  const user_id = connectedUser?.id;


  const groupType = (type: string) => {
    switch (type) {
      case "protected":
        return (
          <div className="group-type">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                opacity="1"
                d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0z"
              />
            </svg>
            <i className="fa-solid fa-shield"></i>
            <p>Protected</p>
          </div>
        );

      case "private":
        return (
          <div className="group-type">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                opacity="1"
                d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
              />
            </svg>
            <i className="fa-solid fa-lock"></i>
            <p>Private</p>
          </div>
        );
      default:
        return (
          <div className="group-type">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                opacity="1"
                d="M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144v48H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V256c0-35.3-28.7-64-64-64H144V144z"
              />
            </svg>
            <i className="fa-solid fa-unlock"></i>
            <p>Public</p>
          </div>
        );
    }
  };

  
  const handleDeleteGroup = async (group_id: string) => {
    try {
        const tokens: any = await getTokensFromCookie();

        if (!tokens) {
            navigate("/error-page/401");
            return ;
        }
        const response = await fetch(prepareUrl(`room/${group_id}/delete`), {
          method: "DELETE",
          body: JSON.stringify({roomId: group_id}),
          headers: {
            "Content-Type": "application/json",
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
          },
        });
        const res = await response.json();

        if (res?.statusCode !== undefined){
          throw new Error('Try again, Later!');
        }
        
        if (!response.ok){
          throw new Error('Try again, later!');
        }
        navigate(`/groups`);
        toast.success('The group has been successfully deleted')
    } catch (error) {
      toast.error('Try again, later!')
    }

  }

  const handleQuiteGroup = async (group_id: string) => {
    try {
        const tokens: any = await getTokensFromCookie();

        if (!tokens) {
            navigate("/error-page/401");
            return ;
        }
        const response = await fetch(prepareUrl(`room/${group_id}/leaveROOM`), {
          method: "POST",
          body: JSON.stringify({ userId: user_id, roomId: group_id }),
          headers: {
            "Content-Type": "application/json",
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
          },
        });

      const res = await response.json();
      if (res?.statusCode !== undefined) {
        throw new Error('Try again, later!');
      }
      if (!response.ok){
        throw new Error('Try again, later!');
      }
      
      navigate(`/groups`);
      toast.success('You left the room successfully')
    } catch (error) {
      toast.error('Try again, later!')
    }
  }

  const handleJoinGroup = async (group_id: string) => {
    
    const password = joinGroupPasswordRef?.current?.value || '';
    try {
            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/error-page/401");
                return ;
            }
            let response = await fetch(prepareUrl(`room/joinRoom`), {
            method: "POST",
            body: JSON.stringify({ userId: user_id, roomId: group_id, password: password }),
            headers: {
              "Content-Type": "application/json",
              'access_token': tokens.access_token,
              'refresh_token': tokens.refresh_token
            },
          });
          const res = await response.json();
          if (res?.statusCode !== undefined) {
            throw new Error(res?.message);
          }
          if (!response.ok){
            throw new Error(res?.message);
          }
          
          navigate(`/groups`);
          toast.success('You joined the room successfully!');
    } 
    catch (error) {
      toast.error('Try again, later!')
    }
  }

  
  const memberShip = (userType: string, groupType: string) => {

    if(groupInfos?.banned_members?.some((member) => member.id === user_id)){
      return <div className="banned-muted-user">You are banned from this group</div>
    }

    if(groupInfos?.muted_members?.some((member) => member.id === user_id)){
      return <div className="banned-muted-user">You are muted for the moment</div>
    }

    if (userType === "visitor") {
      if (groupType === "public") {
        return (
          <div className="actions-buttons" data-membership="visitor">
            <button onClick={() => handleJoinGroup(groupInfos.id)} className="action-button button-active">Join Group</button>
          </div>
        );
      }
      if(groupType === "private"){
        return(
          <div className="actions-buttons" data-membership="visitor">
            {members_requests?.some((item: any) => item.id === user_id) ? '' : <button onClick={() => handleJoinGroup(groupInfos.id)} className="action-button button-active">Send Request</button>}
          </div>
        )
      }

      if (groupType === "protected") {
        return (
          <div className="actions-buttons" data-membership="member">
            <div className="form-control">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                ref={joinGroupPasswordRef}
                type="text"
                name="password"
                id="password"
                className="group-password"
                placeholder="Enter the password"
              />
            </div>
            <button onClick={() => handleJoinGroup(groupInfos.id)} className="action-button button-active">Join Group</button>
          </div>
        );
      }
    }
    if (userType === "member") {
      return (
        <div className="actions-buttons" data-membership="member">
          {/* <Link to={`${groupType=== 'public' ? '/publiGroup' : '/privateGroup'}`} className="action-button button-inactive"> */}

          <button onClick={() => handleQuiteGroup(groupInfos.id)} className="action-button button-inactive">Quit Group</button>
        </div>
      );
    }

    // smililar to member, admin
    if (userType === "admin") {
      return (
        <div className="actions-buttons" data-membership="admin">
          <button onClick={() => handleQuiteGroup(groupInfos.id)} className="action-button button-inactive">Quit Group</button>
        </div>
      );
    }

    if (userType === "owner") {
      return (
        <div className="actions-buttons" data-membership="owner">
          <button onClick={() => handleQuiteGroup(groupInfos.id)} className="action-button button-inactive">Quit Group</button>
          <button onClick={() => handleDeleteGroup(groupInfos.id)} className="action-button button-inactive">
            Delete Group
          </button>
        </div>
      );
    }
  };

  return (
    <>
      {groupType(groupInfos.type)}
      <div className="group-subtitle page-subtitle">Group</div>
      <div className="group-title page-title">{groupInfos.name}</div>
      {memberShip(groupInfos?.userType, groupInfos?.type)}
    </>
  );
};

export default GroupInfos;
