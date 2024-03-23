import React, { useEffect, useRef, useState } from "react";
import "./GroupSettingsStyle.css";
import useWindowSize from "../../../utils/hooks/useWindowSize";
import { useNavigate } from "react-router-dom";
import { useConnectedUser } from '../../../context/ConnectedContext';
import { toast } from "react-toastify";
import { getTokensFromCookie, prepareUrl } from "../../../utils/utils";
import Header from "../../../components/Header/Header";


interface GroupSettingsProps {
  members: any;
  admins: any; 
  componentFor: any; 
  groupInfos: any; 
  setData: (data: any) => void; 
}

interface RoomCredentials {
  url: string;
  room: {
    roomName: string;
    password?: string;
    roomType: string;
    admins?: any[];
  };
}

const GroupSettings: React.FC<GroupSettingsProps> = ({ members, admins, componentFor, groupInfos, setData }) => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const groupNameRef = useRef<HTMLInputElement>(null);
  const groupTypeRef = useRef<HTMLSelectElement>(null);
  const groupSettingsRef = useRef<any>(null);
  const { width, height } = useWindowSize();
  const [roomCredentials, setRoomCredentials] = useState<RoomCredentials | null>(null);
  const navigate = useNavigate();
  const [editedSelectedValues, setEditedSelectedValues] = useState([])
  const [selectedChange, setSelectedChange] = useState(false);

  // VALIDATE DATA
  const validateGroupName = (name: string) => {
    if(name.length === 0) {
      toast.warning('The group name must not be empty')
      return false;
    }

    if(name.length > 12) {
      toast.warning('The name should not be more than 12 character');
      return false
    }

    if(typeof name !== "string") {
      toast.warning('The group name must be string')
      return false;
    } 

    if(name.length < 5) {
      toast.warning('The group name length must be more than 5 characters')
      return false;
    }

    return true;
  }

  const validateGroupPassword = (password: string) => {
    const regex = {
      lowercase: /[a-z]/,
      uppercase: /[A-Z]/,
      number: /[0-9]/,
      special: /[$@#&!]/,
    };
  
    let strength = 0;
  
    if(password.length === 0) {
      toast.warning('The password should not be empty');
      return false
    }

    if(password.length > 24) {
      toast.warning('The password should not be more than 24 character');
      return false
    }

    if (password.length < 8) {
      toast.warning('The password must be more than 8 characters');
      return false

    }
  
    if (regex.lowercase.test(password)) {
      strength += 1;
    }
  
    if (regex.uppercase.test(password)) {
      strength += 1;
    }
  
    if (regex.number.test(password)) {
      strength += 1;
    }
  
    if (regex.special.test(password)) {
      strength += 1;
    }
    if(strength <= 3){
      toast.warning('The password must be strong');
      return false
    }

    return true;

  
  }

  const validateGroupType = (type: any) => {
    if(type === 'public' || type === 'protected' || type === 'private' || '') return true;
    toast.warning('The group type must be public, protected or private') 
    return false
  }
  const [type, setType] = useState("");

    const { connectedUser } = useConnectedUser()
    const user_id = connectedUser?.id;

  const fetchData = async (roomCredentials: any) => {

    const tokens: any = await getTokensFromCookie();

    if (!tokens) {
      navigate("/notauth");
    }
    
    if (roomCredentials?.url.includes('create')) {
      try {
        const response = await fetch(roomCredentials.url, {
          method: "POST",
          body: JSON.stringify(roomCredentials.room),
          headers: {
            "Content-Type": "application/json",
            'access_token': tokens.access_token,
            'refresh_token': tokens.refresh_token
          },
        });

        const res = await response.json();
        //console.log('reeees', res);
        if (res?.statusCode !== undefined){
          throw new Error('Try again, Later!');
        }
        if (!response.ok){
          throw new Error('Try again, Later!');
        }
        //console.log('The group is well created!');
        toast.success('The group is well created!');
        navigate(`/groups`);
      } catch (error) {
        toast.error('Try again, Later!')
      }
    }
    if (roomCredentials?.url.includes('update')) {
      try {
          const response = await fetch(roomCredentials.url, {
            method: "POST",
            body: JSON.stringify({
              roomName:  roomCredentials?.room?.roomName,
              password: roomCredentials?.room?.password,
              roomType: roomCredentials?.room?.roomType,
              admins: roomCredentials?.room?.admins,
            }),
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
            throw new Error(res?.message);
          }
          setData((prevValue: any) => res)
          toast.success('The group infos are well updated');
      } catch (error) {
        toast.error('Try again, Later!')
      }
    }
  }

  useEffect(() => {
    if(roomCredentials) fetchData(roomCredentials);
  }, [roomCredentials])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (componentFor === 'create') {
      if (passwordRef?.current && groupNameRef?.current && groupTypeRef?.current){
        if(!validateGroupName(groupNameRef?.current.value)|| !validateGroupType(groupTypeRef?.current.value)) return;
        if(groupTypeRef?.current.value.toLowerCase() === 'protected' && !validateGroupPassword(passwordRef?.current.value)) return;
        
        const room = {
          roomName:       groupNameRef.current.value,
          roomType:       groupTypeRef.current.value,
          password:      passwordRef.current.value,
          isProtected:    groupTypeRef.current.value === 'protected',
          ownerID:        user_id,
          image:         '',
          users:         []
        }
        setRoomCredentials({url: prepareUrl(`room/createRoom`), room})
      }
    }

    if (componentFor === 'edit') {
      if (passwordRef?.current && groupNameRef?.current && groupTypeRef?.current){

        if(!validateGroupName(groupNameRef?.current.value)|| !validateGroupType(groupTypeRef?.current.value)) return;
        if(groupTypeRef?.current.value.toLowerCase() === 'protected' && !validateGroupPassword(passwordRef?.current.value)) return;
        const room = {
          roomName:       groupNameRef.current.value,
          roomType:       groupTypeRef.current.value,
          password:       passwordRef.current.value,
          admins:         selectedChange ? editedSelectedValues : admins.map((admin: any) => admin.id)
        }
        setRoomCredentials({url: prepareUrl(`room/${groupInfos.id}/updateRoom`), room})
      }
    }
  }

  //useEffect(() => {
  //  console.log('editedSelectedValues =>', editedSelectedValues );
  //}, [editedSelectedValues])

  useEffect(() => {
    if (groupTypeRef.current) {
      setType(groupTypeRef.current.value);
    }

    if (type !== "protected") {
      if (passwordRef.current) {
        passwordRef.current.disabled = true;
        passwordRef.current.style.backgroundColor = "lightgray";
      }
    } else {
      if (passwordRef.current) {
        passwordRef.current.disabled = false;
        passwordRef.current.style.backgroundColor = "#fff";
      }
    }
  }, [type, groupTypeRef]);

  useEffect(() => {
    if (groupSettingsRef.current && componentFor === "create") {
      groupSettingsRef.current.style.marginTop = "5rem";
      groupSettingsRef.current.style.marginBottom = `calc(100vh - ${groupSettingsRef.current.offsetHeight}px - 45.594px - 24px - 5.5rem - (1.5rem * 2))`;
    }
  }, [groupSettingsRef, width, height]);

  return (
    <>
    {componentFor === "create" /*&& <Header isConnected={true}  />*/}
    <div
      ref={groupSettingsRef}
      className={`group-settings ${
        componentFor === "create" ? "container" : ""
      }`}
      // style={{ marginBottom: "calc(100vh - 10rem)", marginTop: "5rem" }}
    >
      <div className="group-settings-content">
        <div className="group-settings-header">
          <div className="group-settings-title">
            {componentFor === "edit" ? "Group Settings" : "Create Group"}
          </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="form-inputs">
              <div className="form-control">
                <label htmlFor="group-name">Name</label>
                <input
                  ref={groupNameRef}
                  type="text"
                  className="group-name"
                  id="group-name"
                  defaultValue={`${
                    componentFor === "edit" ? groupInfos?.name : ""
                  }`}
                />
              </div>
              <div className="form-control">
                <label htmlFor="group-password">password</label>
                <input
                  ref={passwordRef}
                  type="password"
                  className="group-password"
                  id="group-password"
                  // value="12345685"
                />
              </div>
              <div className="form-control">
                <label htmlFor="group-type">Group Type</label>
                <select
                  ref={groupTypeRef}
                  onChange={(e) => setType(e.target.value)}
                  name="group-type"
                  id="group-type"
                  defaultValue={`${
                    componentFor === "edit" ? groupInfos?.type : ""
                  }`}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="protected">Protected</option>
                </select>
              </div>
            </div>
            {componentFor === "edit" && (
              <div
                className="form-control form-control-admins"
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  alignSelf: "flex-start",
                }}
              >
                {/* <label htmlFor="group-admins">Admins</label> */}
                {/* <SelectComponent
                  options={members}
                  onChange={() => {setSelectedChange(true)}}
                  selectedValues={admins}
                  // style={{ gridColumn: 1 / -1 }}
                  setEditedSelectedValues = {setEditedSelectedValues}
                  // handleEditedValues={handleEditedValues}
                /> */}
              </div>
            )}
            <div className="actions-buttons">
              <input
                className="action-button button-active"
                type="submit"
                value={componentFor === "edit" ? "Save Changes" : "Create"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default GroupSettings;
