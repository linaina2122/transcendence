import io from "socket.io-client";
import React, { useEffect, useState, useContext } from "react";
import { getCookie, getTokensFromCookie, prepareUrl } from '../utils/utils';

const SocketContext = React.createContext(null);

const SocketProvider: React.FC<any> = ({ children }) => {
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {

        const gat = getCookie('access_token');
        const grt = getCookie('refresh_token');

      if (gat && grt) {

        const establishSocketConnection = async () => {
        const tokens = await getTokensFromCookie();

        if (!tokens) {
            //console.log('There is no token here!');
            return;
        }

        const newSocket = io(prepareUrl("chat"), {
            query: {
                access_token: tokens.access_token,
            },
        });

        newSocket.on('error', (error :any) => {
            console.error('Socket connection error:', error);
        });

        //console.log('socket here: ', tokens.access_token,)

        setSocket(newSocket);
        };

        establishSocketConnection();
      }

        
    }, []);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket)
        {
            console.log('--------------------------------------');

        }
        return socket;
}

export { SocketContext, SocketProvider, useSocket };