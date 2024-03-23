import React from 'react';
import './PlayerCardStyles.css'
import { prepareUrl } from '../../../utils/utils';

const PlayerCard: React.FC<any> = ({ player, playerType, winner, score }) => {
  return (
    <div className="player-card" data-type={playerType} data-winner={winner === null ? '' : winner}>
      <div className="player-card-content">
        <div className="player-card-header">
          <div className="player-card-image">
            <img src={ prepareUrl(player?.image) } alt="Player image" />
          </div>
          <div className="player-infos">
            <div className="player-fullname">{player?.fullname}</div>
            <div className="player-username">{player?.username}</div>
          </div>
        </div>
        <div className="player-card-body">
          <div className="player-stats">
            <div className="stats-infos" id="ranking">
              <div className="stats-number">{player?.ranking}</div>
              <p className="stats-title">Ranking</p>
            </div>
            <div className="stats-infos" id="player-matches">
              <div className="stats-number">{player?.matches}</div>
              <p className="stats-title">Matches</p>
            </div>
            <div className="stats-infos" id="level">
              <div className="stats-number">{player?.level}</div>
              <p className="stats-title">Level</p>
            </div>
          </div>
        </div>
        {(score !== null) && (<div className="player-card-footer">
          <span className='player-score-title'>Score:</span> <span className='player-score'>{score}</span>
        </div>)}
      </div>
    </div>
  );
};

export default PlayerCard;
