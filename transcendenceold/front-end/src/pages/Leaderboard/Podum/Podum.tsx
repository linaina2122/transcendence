import React, { useEffect, useState } from 'react'
import "./PodumStyle.css"
import { LeaderBoardType } from '../../../types'
import { getLeaderboardOfPlayers, prepareUrl } from '../../../utils/utils';
import { Link } from 'react-router-dom';

interface data {
  dataLeaderboard: LeaderBoardType [] | null;
}

function Podum(props: data) {

  return (
    <> 
        <div className="podium">
      { props.dataLeaderboard && (
          <>
            { props.dataLeaderboard.length >= 2 && (
              <div className="level-2">
                <div className="leadboard-card">
                  <div className="leadboard-card-content">
                    <div className="leadboard-image">
                      <img src={prepareUrl("") + props.dataLeaderboard[1].avatarUrl} alt={props.dataLeaderboard[1].username} /> 
                    </div>
                    <div className="leadboard-infos">
                      <Link to={`/profile/${props.dataLeaderboard[1].id}`} className="leadboard-username">
                        {props.dataLeaderboard[1].username}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="stage"></div>
              </div>
            )}

            {props.dataLeaderboard.length >= 1 && (

              <div className="level-1">
                <div className="leadboard-card">
                  <div className="leadboard-card-content">
                    <div className="leadboard-image">
                      <img src={prepareUrl("") + props.dataLeaderboard[0].avatarUrl} alt={props.dataLeaderboard[0].username} />
                    </div>
                    <div className="leadboard-infos">
                      <Link to={`/profile/${props.dataLeaderboard[0].id}`} className="leadboard-username">
                        {props.dataLeaderboard[0].username}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="stage"></div>
              </div>

            )}
            
            { props.dataLeaderboard.length >= 3 && (
              <div className="level-3">
                <div className="leadboard-card">
                  <div className="leadboard-card-content">
                    <div className="leadboard-image">
                    <img src={prepareUrl("") + props.dataLeaderboard[2].avatarUrl} alt={props.dataLeaderboard[2].username} /> 
                    </div>
                    <div className="leadboard-infos">
                      <Link to={`/profile/${props.dataLeaderboard[2].id}`} className="leadboard-username">
                        {props.dataLeaderboard[2].username}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="stage"></div>
              </div>
            )}
          </>
      )}
      </div>
    
    </>
  )
}

export default Podum
