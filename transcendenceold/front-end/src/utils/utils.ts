import axios, { AxiosError } from 'axios';
import { HistoryGameReturnedType, LeaderBoardType, Tokens, UserType } from '../types';

export function prepareUrl(url: string): string {

    let host: string = `http://${process.env.REACT_APP_PUBLIC_IP}:${process.env.REACT_APP_BACK_END_PORT}/`;

    host += url;

    return host;

}

export async function getNumberOfFriends(userId: string | undefined, tokens: Tokens ): Promise<number | null> {

    // console.log(`user id ${userId}`)

    if (userId === undefined) {
        return null;
    }

    // the url
    let url: string = prepareUrl("friend/numberoffriends/") + userId;
    // const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
        return null;
    }

    // make the req to the server
    const response = await fetch(url, {
    method: "GET",
        headers: {
            'access_token': tokens.access_token as string,
            'refresh_token': tokens.refresh_token as string 
        },
    });
    const res = await response.json();
    if (res?.statusCode !== undefined){
        return null;
    }

    return res?.number;
}

export function getCookie(name: string) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName.trim() === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

export async function getTokensFromCookie(): Promise<Tokens | null> {
    let gat = getCookie('access_token');
    let grt = getCookie('refresh_token');

    let resData = null;

    // need to check if the tokens are valid
    // need to call the get me end point 

    try {
        const url: string = prepareUrl("users/me");

        const data = await axios.get(url, {
            headers: {
                refresh_token: grt,
                access_token: gat,
            }
        })
        .then(response => {
            return response;
            
        })
        .catch(err => {
            
            if (err.response.status === 401) {
                throw new Error("need to refresh the access token")
            }

            if (err instanceof AxiosError) {
                throw new Error("need to refresh the access token")
            }
            return null;
        }) 

        if (!data) {
            return null;
        }

        if (data.status !== 200) { throw new Error("need to refresh the access_token") ; }

        const tokensRet: Tokens = {
            access_token: gat,
            refresh_token: grt,
        };

        return tokensRet;
    } catch (error) {

        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        const url: string = prepareUrl("auth/refresh/");

        // refresh the access token
        resData = await axios.get(url, {
            headers: {
                refresh_token: grt,
            },
        });

        
        if (resData.data.message !== 'done') return null;
        
        document.cookie = resData.data.access_token
        document.cookie = resData.data.refresh_token

        return {
            access_token: gat,
            refresh_token: grt,
        }
    }

    return null;
}

export async function getIsFriend(userId: string, tokens: Tokens) : Promise<{ relation: string }> {

    // const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return { relation: "nothing" };

    const resData = await axios.get(prepareUrl("friend/isfriend/") + userId, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        }
    })

    if (resData) { 
        return {
            relation: resData.data.relationShip
        }
    }
    
    return { relation: "nothing" };
}

export async function getHisGamesByUserId(
    userId: string | null,
    tokens: Tokens
): Promise<HistoryGameReturnedType[] | null> {
    // const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) {
        return null;
    }

    if (!userId) {
        const user: UserType | null = await getUserInfo();

        if (!user) {
            return null;
        }

        userId = user.id;
    }

    const url: string = prepareUrl("history-game/games/") + userId;

    const resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    const rHisgame: HistoryGameReturnedType[] = resData.data;

    return rHisgame;
}

export async function validateTowFactor(code: number): Promise<UserType | null> {

    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    const url: string = prepareUrl("tow-factor-auth/confirm/") + code;

    const resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        }
    })
    .then((response) => response)
    .catch((err) => {});

    if (!resData || resData.data.message ) return null;

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    return userData;
}

export async function generateTowFactorQrCode(): Promise<UserType | null> {

    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    const url: string = prepareUrl("tow-factor-auth/validated")

    const resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        }
    })
    .then((response) => response)
    .catch((err) => {});

    if (!resData) return null;

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    return userData;
}

export async function updateUser(user: UserType): Promise<UserType | null> {
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    const url: string = prepareUrl("users/update")

    const resData = await axios
        .put(url, user, {
            headers: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
        })
        .then((response) => response)
        .catch((err) => {});

    if (!resData) {
        return null;
    }

    if (resData.data.message === "notallowed") {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    // return the user data
    return userData;
}

export async function getUserInfo(): Promise<UserType | null> {
    const tokens: Tokens | null = await getTokensFromCookie();

    if (!tokens) return null;

    let resData = null;

    // send the request

    const url: string = prepareUrl("users/me")

    resData = await axios
        .get(url, {
            headers: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
            },
        })
        .then((response) => response)
        .catch((err) => {});

    if (!resData) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        avatarUrl: resData.data.avatarUrl,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        Status: resData.data.Status,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    // return the user data
    return userData;
}

export async function getUserById(
    id: string,
    tokens: Tokens
): Promise<UserType | null> {
    // url
    const url: string = prepareUrl("users/") + id;

    let resData = null;

    // get data from the server
    resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    const userData: UserType = {
        id: resData.data.id,
        username: resData.data.username,
        email: resData.data.email,
        Status: resData.data.Status,
        avatarUrl: resData.data.avatarUrl,
        fullName: resData.data.fullName,
        isOnLine: resData.data.isOnLine,
        towFactorToRedirect: resData.data.towFactorToRedirect,
        levelGame: resData.data.levelGame,
        twoFactor: resData.data.twoFactor,
        qrCodeFileName: resData.data.qrCodeFileName,
    };

    // return the user data
    return userData;
}

export async function getNumberOfWinnedGames(
    userId: string | undefined,
    tokens: Tokens
): Promise<number | null> {
    if (userId === undefined) {
        return null;
    }

    // the url
    let url: string = prepareUrl("history-game/winnedgame/") + userId;

    // const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
        return null;
    }
    let resData = null;
    // make the req to the server
    resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    let win: number;

    if (resData.data.numberWinnedGame === undefined) {
        win = 0;
    } else {
        win = resData.data.numberWinnedGame;
    }

    return win;
}

export async function getLeaderboardOfPlayers() : Promise< LeaderBoardType [] | null > {

    const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
        return null;
    }

    const url: string = prepareUrl("history-game/leaderbord");

    // Get the leaderboard  of the players
    const resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    })

    if (!resData) {
        return null;
    }

    const rData: LeaderBoardType [] = resData.data.slice();

    if (rData.length === 0) {
        return null;
    }

    return rData;
}

export async function getNumberGamePlayedByUserId(
    userId: string | undefined,
    tokens: Tokens
): Promise<number | null> {
    if (userId === undefined) {
        return 0;
    }

    // get the tokens from the local storage
    // const tokens: Tokens | null = await getTokensFromCookie();

    if (tokens === null) {
        return null;
    }

    // get the number of game winned by the player

    const win: number | null = await getNumberOfWinnedGames(userId, tokens);

    if (win === null) {
        return null;
    }

    // the url
    const url = prepareUrl("history-game/losedgame/") + userId;

    let resData = null;

    // make the req to the server
    resData = await axios.get(url, {
        headers: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
        },
    });

    if (!resData.data) {
        return null;
    }

    let lose: number = 0;

    if (resData.data.numberWinnedGame === undefined) {
        lose = 0;
    } else {
        lose = resData.data.numberWinnedGame;
    }

    return win + lose;
}
