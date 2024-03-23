import React from "react";
import CardItem from "../../../components/card-item/CardItem";
import "./BannedMembersStyle.css";
import { Link } from "react-router-dom";
import { useConnectedUser } from '../../../context/ConnectedContext';
import { getTokensFromCookie, prepareUrl } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface BannedMember {
  id: string;
  name: string; 
  status: string | undefined;
  images: string[]
}

interface Data {
  group_id: string | undefined;
  banned_members: BannedMember[];
}

interface BannedMembersProps {
  data: Data | undefined;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}

const BannedMembers : React.FC<BannedMembersProps> = ({ data, setData }) => {

        const { connectedUser } = useConnectedUser()
        const group_id = data?.group_id;
        const user_id = connectedUser?.id;
        const navigate = useNavigate();

      const handleUnBan = async (user_id: any, unbannedId: any) => {
        if (!window.confirm('Are you sure you want to unban had khona?')) return;
        try {
              const tokens: any = await getTokensFromCookie();

              if (!tokens) {
                  navigate("/notauth");
              }
              const response = await fetch(prepareUrl(`room/${group_id}/unban`), {
                method: "POST",
                body: JSON.stringify({ adminId: user_id, roomId: group_id, unbannedId: unbannedId }),
                headers: {
                  "Content-Type": "application/json",
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

              if (res) {
                setData((prevValue: any) => {
                  if (!prevValue) return prevValue; // Handle case where prevValue is undefined
                  return {
                      banned_members: prevValue?.banned_members.filter((item: any) => item.id !== res.id) ,
                      members : res.role === 'member' ? [...prevValue?.members, res] : prevValue?.members,
                      members_requests: prevValue?.members_requests,
                      type: prevValue?.type, 
                      name: prevValue?.name,
                      owner: prevValue?.owner, 
                      admins: res.role === 'admin' ? [...prevValue?.admins, res] : prevValue?.admins,
                      muted_members: prevValue?.muted_members
                }
                });
            }
        } catch (error) {
          toast.error('An error occurred, Please try again.')
        }
    }


    
  const footerButtons = (id: any) => [
    <li onClick={ () => handleUnBan(user_id, id) } key={`unban-${id}`} className="card-button tooltip">
      <Link onClick={(e) => e.preventDefault()} to={""}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="16"
          width="14"
          viewBox="0 0 448 512"
        >
          <path
            opacity="1"
            d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
          />
        </svg>
      </Link>
      <span className="tooltiptext">Unban</span>
    </li>,
  ];

  return (
    <div className="banned-members">
      <div className="banned-members-content">
        <div className="banned-members-title">Banned Members</div>
        <div className="banned-members-cards cards-content scrollbar">
          {data && data.banned_members && data.banned_members.length > 0 && // TODO: had line tbadle
            data?.banned_members?.map((item, index) => {
              const key = `key-${index}`;
              return (
                <CardItem
                  key={key}
                  data={item}
                  footerButtons={footerButtons(item?.id)}
                />
              );
            })}
            {data?.banned_members?.length === 0 && <div className="empty-content" style={{textAlign: 'center'}}>No Banned members</div>}
        </div>
      </div>
    </div>
  );
};

export default BannedMembers;
