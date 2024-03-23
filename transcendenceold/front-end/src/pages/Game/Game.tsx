
import { io, Socket } from "socket.io-client"
import { useEffect, useState } from "react";
//import './style/WaitingPage.css'
import { fromBack } from "./objects";
import { InitSetup } from './rander_scene';
import { Duel } from "./Duel";
import { prepareUrl } from "../../utils/utils";
import { useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import './players/p.css'
import PlayerCard from "./player-card/PlayerCard";
import PulsedCard from "./pulsed-card/PulsedCard";
import { useConnectedUser } from '../../context/ConnectedContext';
import { getTokensFromCookie, getUserById } from "../../utils/utils";
import { Tokens, UserType } from "../../types";

let leftPlayerScore = 0;
let rightPlayerScore = 0;
export const Player: Socket = io(prepareUrl(""), { autoConnect: true });



function SendData(userid: string | undefined) {
  
  console.log("User ID ", userid)
  Player.emit("onJoinGame", {userId: userid});

}
function onVs() {
  Player.emit("OneVSone")
}

function App() {
  const [connect, setSocket] = useState(false)
  const [isStart, setStart] = useState(false)
  const [isDuo, setDuo] = useState(false)
  const [BposX, setPosX] = useState(0)
  const [BposY, setPosY] = useState(0)

  useEffect(() => {
    function isConnect() {
      if (Player.connected) {}
      setSocket(true)
    }
    Player.on("connect", isConnect)
    Player.on("StartGame", (data: boolean) => {
      setStart(data)
    })
  }, [])
  
  useEffect(() => {
    Player.on("vsOne", (data: boolean) => {
      setDuo(data);
    })
  }, [])
 
  Player.on("startGame2", (dataX: any, dataY: any) => {
    setPosX(dataX);
    setPosY(dataY);
    fromBack.posX = BposX;
    fromBack.posY = BposY;
  })

  useEffect(() => {
    Player.on("Lplayer_score", () => {
      leftPlayerScore++;
      console.log("lscore", leftPlayerScore);
    })
    Player.on("Rplayer_score", () => {
      rightPlayerScore++;
      console.log("rscore :", rightPlayerScore);
    })
}, [])


  ///////////////////////////////////////////////////////////////////////////////////////////
  const { connectedUser, setConnectedUser } = useConnectedUser();

  	// GET THE CURRENT PAGE LOCATION
	const location = useLocation();
  
  const {id, scores} = useParams();
  const [winnerOne, setWinnerOne] = useState<any>(null)
  const [winnerTwo, setWinnerTwo] = useState<any>(null)
  const [scoreOne, setScoreOne] = useState<any>(null)
  const [scoreTwo, setScoreTwo] = useState<any>(null)
  const [playerOne, setPlayerOne] = useState<any>(null);
  const [playerTwo, setPlayerTwo] = useState<any>(null);
  
  const navigate = useNavigate();

  useEffect(() => {

    // gaurd();
  }, []);
  
  const gaurd = async () => {

    // if there is no tokens the user will be redirected to not auth page this will be the Gaurd
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens || !tokens.access_token || !tokens.refresh_token) {
      navigate("/error-page/:401")
    }

    if (connectedUser?.twoFactor && connectedUser?.towFactorToRedirect) {
      navigate("/tow-factor")
    }

    await initData(tokens);
  }


  const initData = async (tokens: Tokens | null) => {

    if (tokens && tokens.access_token && tokens.refresh_token) {

      const otherUser: UserType | null = await getUserById(id as string, tokens);
      
      setPlayerTwo((previousValue: any) => {
        return {
          fullname: otherUser?.fullName,
        username: otherUser?.username,
        ranking: 20,
        matches: 85,
        level: otherUser?.levelGame,
        image: otherUser?.avatarUrl,
        };
      });
    }

  }

  useEffect(() => {
    setPlayerOne((previousValue: any) => {
      return {
        fullname: connectedUser?.fullName,
        username: connectedUser?.username,
        ranking: 20,
        matches: 85,
        level: connectedUser?.levelGame,
        image: connectedUser?.avatarUrl,
      };
    });

    if(id){
      gaurd();

    }
    if(location.pathname === '/game/guest'){
      setPlayerTwo((previousValue:any) => {
        return {
          fullname: "Guest",
          username: "Guest",
          ranking: '▮',
          matches: '▮',
          level: '▮',
          image: "public/avatars/default.png",
        };
      });
    }

    if(scores){
      const [score1, score2] = scores.split('&');
      setScoreOne((previousValue: any) => Number.parseInt(score1));
      setScoreTwo((previousValue: any) =>  Number.parseInt(score2));
      setWinnerOne((previousValue: any) => Number.parseInt(score1) >= Number.parseInt(score2))
      setWinnerTwo((previousValue: any) => Number.parseInt(score2) >= Number.parseInt(score1))
    }


  }, []);
  
  const handlePlayTwo = () => {
    SendData(connectedUser?.id)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {!isDuo && !isStart && <section className="section-players">
        <div className="container">
          <div className="section-players-content">
            {playerOne && <PlayerCard player={playerOne} score={scoreOne} winner={winnerOne} playerType="player-1" />}
            {!playerOne && <PulsedCard pulsedType="pulsed-1" />}

            <div className="versus">
              <svg
                className="filled"
                version="1.1"
                x="0px"
                y="0px"
                viewBox="0 0 256 256"
                enableBackground="new 0 0 256 256"
              >
                <g>
                  <g>
                    <path d="M10,57.5l37.8,141.3h52.2l36.8-141.5H85.6L73.4,102l-12-44.6H10L10,57.5z" />
                    <path d="M142.4,57.5l-25.4,98h50.5l-2.7,11.7h-51l-8.1,31.5h102.4l25.2-94.4h-51.3l3.6-14.7h51l9.2-32H142.4z" />
                  </g>
                </g>
              </svg>
            </div>

            {playerTwo && <PlayerCard player={playerTwo} score={scoreTwo} winner={winnerTwo} playerType="player-2" />}
            {!playerTwo && <PulsedCard pulsedType="pulsed-2" />}
          </div>

          <div className="actions-buttons players-buttons">
            {(!playerOne || !playerTwo) && !isDuo &&(<button onClick={handlePlayTwo} className="action-button button-active">START RANDOM GAME</button>)}
            {(playerOne && playerTwo) && !isDuo && (<button onClick={onVs} className="action-button button-active">Start Game</button>)}
            {(playerOne && playerTwo) && !isDuo && (<Link to='/profile'  className="action-button button-inactive">Cancle</Link>)}
            {(!playerOne || !playerTwo) && !isDuo && (<Link to='/profile'  className="action-button button-inactive">Cancle</Link>)}
          </div>
        </div>
      </section>}
      {isDuo && <Duel />}
      {isStart && <InitSetup />}
    </>
  );


  // return (
  //   <div>
  //     {!isDuo && !isStart && (
  //       <div id="StartButton" className="StartButton">
  //         <button className="btn" onClick={SendData}>START GAME</button>
  //         <button className="OneVsOne" onClick={onVs}>Play Duo</button>
  //       </div>
  //     )}
  //     {isDuo && <Duel />}
  //     {isStart && <InitSetup />}
  //   </div>
  // );
}
export default App;