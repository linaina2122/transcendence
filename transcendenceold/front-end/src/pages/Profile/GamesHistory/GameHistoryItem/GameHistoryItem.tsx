import React from 'react'
import { HistoryGameReturnedType } from '../../../../types';
import { Link } from 'react-router-dom';

function GameHistoryItem(props: HistoryGameReturnedType) {
    const { player1, player2, timestamp } = props;
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    return (

      <tr>
        <td>
          <Link to={`/profile/${player2.id}`}>
            {player1.username}
          </Link>
        </td>
        <td>{player1.score}</td>
        <td>{player2.score}</td>
        <td>
          <Link to={`/profile/${player2.id}`}>
            {player2.username}
          </Link>
        </td>
        <td>{`${year}-${month}-${day}`}</td>
      </tr>
    );
}

export default GameHistoryItem
