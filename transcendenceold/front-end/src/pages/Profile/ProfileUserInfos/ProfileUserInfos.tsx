import React, { useContext, useEffect, useState } from 'react'
import "./ProfileUserInfosStyle.css"
import { UserType } from '../../../types';
import Spinner from '../../../components/Spinner/Spinner';
import { getTokensFromCookie, prepareUrl } from '../../../utils/utils';
import { getNumberGamePlayedByUserId, getNumberOfFriends } from '../../../utils/utils';

interface UserInfoType {
  userData: UserType | null,
  numberGamePlayed: number,
  numberFrined: number,
  personal: boolean
}

function ProfileUserInfos(props: UserInfoType) {

  const [numberFrined, setNumberFrined] = useState<number>(0);
  const [numberGamePlayed, setNumberGamePlayed] = useState<number>(0);

  const iniOtherData = async (userId: string | undefined) => {

    if (userId === undefined) return;
    //console.log('+++++++++ user id ++++++++', userId);
    const tokens: any = await getTokensFromCookie();
    // get the number of game played by the player
    const numberOfGames: number | null = await getNumberGamePlayedByUserId(userId, tokens)
        
    if (!numberOfGames) {
      setNumberGamePlayed(0);
    } else {
      setNumberGamePlayed(numberOfGames);
    }

    // get the number of friends by id by default right now will be 0 
    const numberOfFriends: number | null = await getNumberOfFriends(userId, tokens)

    if (!numberOfFriends) {
      setNumberFrined(0);
    } else {
      setNumberFrined(numberOfFriends);
    }
  }

  useEffect(() => {
    iniOtherData(props.userData?.id);
  }, [props.userData?.id])

  return (
    <>
    { props.userData ? (
      <div className="profile-user-infos">

        <div className="profile-user-image">
          <img src={ prepareUrl("") + props.userData?.avatarUrl} alt="user image" />
        </div>

        <div className="profile-user-description">
          <div className="profile-user-fullname">{props.userData?.fullName}</div>
          <p className="profile-user-username">{props.userData?.username}</p>
          {props.personal && (<p className="profile-user-status">{props.userData?.Status}</p>)}
        </div>

        <div className="profile-user-stats">
          <div className="stats-infos" id="friends">
            <div className="stats-number">{numberFrined}</div>
            <p className="stats-title">Friends</p>
          </div>
          <div className="stats-infos" id="played-games">
            <div className="stats-number">{numberGamePlayed}</div>
            <p className="stats-title">Played games</p>
          </div>
          <div className="stats-infos" id="level">
            <div className="stats-number">{props.userData?.levelGame}</div>
            <p className="stats-title">Level</p>
          </div>
        </div>
      </div>

    ) : (
      <Spinner />
    )

    }
    </>
  )
}

export default ProfileUserInfos
