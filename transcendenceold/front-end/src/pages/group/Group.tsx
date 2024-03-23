import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GroupInfos from "./group-infos/GroupInfos";
import GroupSettings from "./group-settings/GroupSettings";
import MembershipRequests from "./membership-requests/MembershipRequests";
import BannedMembers from "./banned-members/BannedMembers";
import MutedMembers from "./muted-members/MutedMembers";
import Role from "./role/Role";
import "./GroupStyle.css";
import { useConnectedUser } from '../../context/ConnectedContext';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getTokensFromCookie, prepareUrl } from "../../utils/utils";
import Header from "../../components/Header/Header";


const Group: React.FC = () => {
    const [userType, setUserType] = useState('');
    const [data, setData] = useState<any>({});
    const [value, setValue] = useState<any>({});
    const { connectedUser } = useConnectedUser()
    const user_id = connectedUser?.id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); 

    const {id} = useParams();
    
    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {

        setLoading(true);

            const tokens: any = await getTokensFromCookie();

            if (!tokens) {
                navigate("/error-page/401");
                return ;
            }
        
            try {
                const response = await fetch(prepareUrl(`room/${id}`), {
                method: "GET",
                headers: {
                    'access_token': tokens.access_token,
                    'refresh_token': tokens.refresh_token
                },
                });
                const res = await response.json();
                if (res?.statusCode !== undefined){
                    navigate(`/error-page/${res?.statusCode}`);
                    // throw new Error('Try again, Later!');
                    return;
                }
                setValue(res);
            } catch (error) {
                toast.error('Try again, Later!')
            } finally {
                setLoading(false);
            }
    }

    
    useEffect(() => {

        if (connectedUser?.twoFactor && connectedUser?.towFactorToRedirect) {
            navigate("/tow-factor")
        }
        
        if (Object.keys(value).length) {
            if (user_id === value?.owner[0]?.id) {
                setUserType('owner');
            } else if (value?.admins?.find((admin: any) => admin?.id === user_id)) {
                    setUserType('admin');
            } else if (value?.members?.find((member: any) => member?.id === user_id)) {
                    setUserType('member');
            } else {
                setUserType('visitor');
                }
            setData(value);
            }
    }, [value]);
    

    if (loading) {
        return <>
                <div>Future is Loading...</div>
            </>
        }
        
        return  (
            <>
            {/*<Header isConnected={true}  />*/}
        <section className="group" data-group-type="protected">
                <div className="container">
                    <div className="group-content" data-status="online">
                    <GroupInfos
                        groupInfos={{
                            id: id || '',
                            name: data?.name,
                            type: data?.type,
                            userType: userType,
                            banned_members: data?.banned_members,
                            muted_members: data?.muted_members
                        }}

                        members_requests={data?.members_requests}
                    />
                    {data?.type === "protected"}
                    {((userType === "owner" || userType === "admin") && !data?.banned_members?.some((member: any) => member.id === user_id)) && (
                        <>
                        <GroupSettings
                            componentFor='edit'
                            members={data?.members?.map((member: any) => ({text: member.name, id: member.id}))}
                            admins={data?.admins?.map((admin: any) => ({text: admin.name, id: admin.id}))}
                            groupInfos={{
                                id: id,
                                name: data?.name,
                                type: data?.type,
                                }}
                            setData={setData}
                            
                        />
                        {data?.type === 'private' && <MembershipRequests data={{members_requests: data?.members_requests, group_id: id}} setData={setData} />}
                        <BannedMembers data={{banned_members: data?.banned_members, group_id: id}} setData={setData} />
                        <MutedMembers data={{muted_members : data?.muted_members, group_id: id}} />
                        </>
                    )}

                    <Role data={{ group_id: id,type: "owner", infos: data?.owner, userType: userType, friends_list: data?.friends_list } } setData={setData} />
                    <Role data={{ group_id: id,type: "admins", infos: data?.admins?.filter((admin: any) => !data?.muted_members?.some((member: any) => member.id === admin.id) && !data?.banned_members?.some((member: any) => member.id === admin.id)), userType: userType, friends_list: data?.friends_list } }setData={setData} />
                    <Role data={{ group_id: id,type: "members", infos: data?.members, userType: userType, friends_list: data?.friends_list } } setData={setData} />
                    </div>
                </div>
                </section>
                </>
            )
        
    
};

export default Group;
