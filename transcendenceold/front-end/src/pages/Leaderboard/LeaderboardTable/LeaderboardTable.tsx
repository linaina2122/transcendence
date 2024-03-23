import React from 'react'
import { LeaderBoardType } from '../../../types';

interface data {
  dataLeaderboard: LeaderBoardType [] | null;
}

function LeaderboardTable(props: data) {

  return (
    <table id="example" className="display" style={{width: '100%'}}>
      <thead>
        <tr>
          <th>Username</th>
          <th>number games</th>
          <th>Rank</th>
        </tr>
      </thead>
      <tbody>
        { props.dataLeaderboard && (
          props.dataLeaderboard.map((value: LeaderBoardType, index: number) => {

            return (
              <tr key={index} >
                <td>{value.username}</td>
                <td>{value.numberGamesPlayed}</td>
                <td>{value.level}</td>
              </tr>
            )
          })
        ) }
      </tbody>
    </table>
  )
}

export default LeaderboardTable
