import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import CardItem from "../../../components/card-item/CardItem";
import "./MembershipRequestsStyle.css";
import { useConnectedUser } from '../../../context/ConnectedContext';
import { getTokensFromCookie, prepareUrl } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


interface MembershipRequestsData {
  members_requests: Array<{ id: string; name: string; status: string; images: string[] }>;
  group_id: string | undefined;
}

interface MembershipRequestsProps {
  data: MembershipRequestsData;
  setData: React.Dispatch<React.SetStateAction<any>>;
}


const MembershipRequests: React.FC<MembershipRequestsProps>  = ({ data , setData}) => {


  const { connectedUser } = useConnectedUser()
      const group_id = data?.group_id;
      const user_id = connectedUser?.id;
      const navigate = useNavigate();

      const handleAccept = async (user_id: any, userTwo: any) => {
        if (!window.confirm('Are you sure you want to Accept had khona?')) return; 
        const tokens: any = await getTokensFromCookie();

        if (!tokens) {
            navigate("/notauth");
        }
        try {
                  const response = await fetch(prepareUrl(`room/${group_id}/accept`), {
                  method: "POST",
                  body: JSON.stringify({ adminId: user_id, roomId: group_id, userTwo: userTwo }),
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
                        banned_members: prevValue?.banned_members ,
                        members : [...prevValue?.members, res],
                        members_requests: prevValue?.members_requests.filter((member: any) => member.id !== res.id),
                        type: prevValue?.type, 
                        name: prevValue?.name,
                        owner: prevValue?.owner, 
                        admins: prevValue?.admins,
                        muted_members: prevValue?.muted_members
                  }
                  });
                  toast.success('The request accepted successfully!');
              };
        } catch (error) {
          toast.error('Try again later!')
        }
    }


    const handleDecline = async (user_id: any, userTwo: any) => {
      if (!window.confirm('Are you sure you want to Decline had khona?')) return;
      try {
              const tokens: any = await getTokensFromCookie();

              if (!tokens) {
                  navigate("/notauth");
              }
              const response = await fetch(prepareUrl(`room/${group_id}/decline`), {
                  method: "POST",
                  body: JSON.stringify({ adminId: user_id, roomId: group_id, userTwo: userTwo }),
                  headers: {
                    "Content-Type": "application/json",
                    'access_token': tokens.access_token,
                    'refresh_token': tokens.refresh_token
                  },
              })
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
                      banned_members: prevValue?.banned_members ,
                      members : prevValue?.members,
                      members_requests: prevValue?.members_requests.filter((member: any) => member.id !== res.id),
                      type: prevValue?.type, 
                      name: prevValue?.name,
                      owner: prevValue?.owner, 
                      admins: prevValue?.admins,
                      muted_members: prevValue?.muted_members
                }
                });
                toast.success('The request declined successfully!');
            };
      } catch (error) {
        toast.error('Try again later!')
      } 
  }

  const footerButtons = (id: any) => [
    <li onClick={() => handleAccept(user_id, id)}  key={`request-1-${id}`} className="card-button tooltip">
      <Link onClick={(e) => e.preventDefault()} to={''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            opacity="1"
            fill="#1E3050"
            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
          />
        </svg>
      </Link>
      <span className="tooltiptext">Accept</span>
    </li>,
    <li onClick={() => handleDecline(user_id, id)} key={`request-2-${id}`} className="card-button tooltip">
      <Link onClick={(e) => e.preventDefault()} to={''}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path
            opacity="1"
            fill="#1E3050"
            d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM471 143c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
          />
        </svg>
      </Link>
      <span className="tooltiptext">Decline</span>
    </li>,
  ];
  
  return (

    <div className="membership-requests">
      <div className="membership-requests-content">
        <div className="membership-requests-title">Membership Requests</div>
        <div className="membership-requests-cards cards-content scrollbar">
          {data?.members_requests?.length > 0 &&
            data?.members_requests?.map((item, index) => {
              const key = `key-${index}`;
              return (
                <CardItem
                  key={key}
                  data={item}
                  footerButtons={footerButtons(item?.id)}
                />
              );
            })}
          {data?.members_requests?.length === 0 && <div className="empty-content" style={{textAlign: 'center'}}>No membership requests sent yet</div>}
        </div>
      </div>
    </div>
  );
};

export default MembershipRequests;
