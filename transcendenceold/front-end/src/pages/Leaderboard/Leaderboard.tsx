import React, { useEffect, useState } from 'react'
import "./LeaderboardStyle.css"
import Podum from './Podum/Podum'
import LeaderboardTable from './LeaderboardTable/LeaderboardTable'
import { useNavigate } from 'react-router-dom'
import { LeaderBoardType, Tokens } from '../../types'
import { getLeaderboardOfPlayers, getTokensFromCookie } from '../../utils/utils'
import Header from '../../components/Header/Header'
import { useConnectedUser } from '../../context/ConnectedContext'

function Leaderboard() {

  const [leaderboard, setLeaderboard] = useState<LeaderBoardType [] | null>(null);

  const navigate = useNavigate();

  const { connectedUser } = useConnectedUser();

  useEffect(() => {
    gaurd();

    initData();
  }, [setLeaderboard])
  
  const gaurd = async () => {

    // if there is no tokens the user will be redirected to not auth page this will be the Gaurd
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) {
      navigate("/error-page/:401")
    }

    if (connectedUser?.twoFactor && connectedUser?.towFactorToRedirect) {
      navigate("/tow-factor")
    }
  }

  const initData = async () => {

    const data: LeaderBoardType [] | null = await getLeaderboardOfPlayers()
    
    setLeaderboard(data)
  }

  return (
    <div>
      {/* <Header isConnected={true}  /> */}
      <section className='profile' >
        <div className='container' >
          <Podum dataLeaderboard={leaderboard} />
          <LeaderboardTable dataLeaderboard={leaderboard} />
        </div>
      </section>
    </div>
  )
}

export default Leaderboard
