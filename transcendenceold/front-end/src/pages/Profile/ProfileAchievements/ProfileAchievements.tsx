import React, { useEffect, useState } from 'react'
import "./ProfileAchievementsStyle.css"
import ProfileAchievement from './ProfileAchievement/ProfileAchievement';
import { getNumberOfWinnedGames, getTokensFromCookie, getUserById, getUserInfo } from '../../../utils/utils';
import { Tokens, UserType } from '../../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnectedUser } from '../../../context/ConnectedContext';

interface ProfileAchievementsType {
  numberGameWinned: number;
} 

function ProfileAchievements(props: ProfileAchievementsType) {


    // const initData = async () => {

    //   const tokens: Tokens | null = await getTokensFromCookie();

    //   if (tokens && tokens.access_token && tokens.refresh_token) {

    //     setUserData(connectedUser);

    //     if (userId) {
    //       // the will be called because the url contains a user id
    //       const otherUser: UserType | null = await getUserById(userId, tokens);

    //       if (otherUser) {
    //         setUserData(otherUser)
    //       }
    //     }

    //     const nGameWinned: number | null = await getNumberOfWinnedGames(userData?.id)
  
    //     if (nGameWinned) {
    //       setNumberGameWinned(nGameWinned);
    //     }

    //   }
      
    // }


    const levels = [1, 2, 3, 4, 5, 6, 7, 20];
    const levelsLength = levels.length;
  return (
    <div className="profile-achievements">
      {levels.map((level, index) => {
        const stage: number = index + 1;
        let isActive: boolean = false;
        if (props.numberGameWinned >= level) {
          isActive = true;
        }
        const title: string =
          levelsLength - 1 === index ? `${level}+` : `${level} match`;
        return (
          <ProfileAchievement
            key={stage}
            stage={stage}
            title={title}
            isActive={isActive}
          />
        );
      })}
    </div>
  )
}

export default ProfileAchievements
