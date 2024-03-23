import React, { useEffect, useState, useContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Footer from './components/Footer/Footer';
import Chat from './pages/Chat/Chat';
import Game from './pages/Game/Game';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import ConnectedProvider from './context/ConnectedContextProvider';
import TwoFactorValidation from './pages/TowFactor/TwoFactorValidation';
import Header from './components/Header/Header';
import { getCookie, getTokensFromCookie, prepareUrl } from './utils/utils';
import ErrorPage from './pages/error-page/ErrorPage';
import { SocketProvider } from './context/SocketProvider';
import CommunityHub from './pages/community-hub/CommunityHub';
import { Tokens } from './types';
import GroupSettings from './pages/group/group-settings/GroupSettings';
import Group from './pages/group/Group';
import Players from './pages/Game/players/Players';
import { ToastContainer } from "react-toastify";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content'
// import { SocketContext, useSocket } from './context/SocketProvider';

// const MySwal = withReactContent(Swal);

function App() {

  useEffect(() => {
    const handlePopState = (event: any) => {
    
      event.preventDefault();
      console.log('popstate');
        // YOUR FUNCTION HERE
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const [isConnected, setIsConnected] = useState<boolean>(false); 
  // const socketData: any = useContext(SocketContext);
  // const socketData: any = useSocket();

  useEffect(() => {

    getAuth()

  }, [setIsConnected])

  const setConnectedUser = () => {

    setIsConnected(!isConnected); 

  }

  const getAuth = async () => {

    const gat = getCookie('access_token');
    const grt = getCookie('refresh_token');

    if (gat && grt) {

      const token: Tokens | null = await getTokensFromCookie();

      if (token) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

    }
  }

  const loginIntra = async () => {

    try {
      
      const url = prepareUrl("auth/42/");
    
      // make call to server to login with the intra 42
      window.location.href = url;

    } catch (error) {
      return ;
    }
  }

  // useEffect(() => {
  //   console.log('socketData =======>', socketData);
  //   if (socketData) {
  //     socketData?.on("requestGame", (newFriendData: any) => {
  //       MySwal.fire({
  //         title: "Do you want to play with this player?",
  //         showDenyButton: true,
  //         showCancelButton: false,
  //         confirmButtonText: "Yes",
  //         denyButtonText: 'No'
  //       }).then((result: any) => {
  //       /* Read more about isConfirmed, isDenied below */
  //       if (result.isConfirmed) {
  //           console.log('OK')
  //       } else if (result.isDenied) {
  //           console.log('NOT OK');
  //       }
  //       });
  //     });
  //   }
  // }, [socketData]);


  return (
    <ConnectedProvider>
      <BrowserRouter>
        <SocketProvider>
        <Header logInFunc={loginIntra} isConnected={isConnected} setIsConnected={setConnectedUser} />
          <Routes>
            <Route path="/" element={<Home logInFunc={loginIntra} />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/friends" element={<CommunityHub type="friends" />} />
            <Route path="/groups" element={<CommunityHub type="rooms" />} />
            <Route path="/group/:id" element={<Group />} />
            <Route
              path="/group/create"
              element={<GroupSettings componentFor="create" members={undefined} admins={undefined} groupInfos={undefined} setData={() => {}} />}
            />
            <Route path="/game" element={<Game />} />
            <Route path="/game/guest" element={<Game />} />
            <Route path="/game/:id" element={<Game />} />
            {/* <Route path="/game/results/:id/:scores" element={<Game />} /> */}
            <Route path="/play/results/:id/:scores" element={<Players />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tow-factor" element={<TwoFactorValidation />} />
            <Route path="/error-page/:code" element={<ErrorPage />} />


          </Routes>
        </SocketProvider>
        <Footer />
            {/* <ToastContainer position="bottom-right" theme="dark" stacked={true} /> */}
      </BrowserRouter>
    </ConnectedProvider>
  );
}

export default App;
