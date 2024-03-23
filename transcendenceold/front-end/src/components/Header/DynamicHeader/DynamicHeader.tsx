import React, { useEffect, useRef, useState, useContext } from 'react'
import { getCookie, getTokensFromCookie, prepareUrl, updateUser } from '../../../utils/utils';
import { Tokens, UserType } from '../../../types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useConnectedUser } from '../../../context/ConnectedContext';
import useClickOutside from '../../../utils/hooks/useClickOutside';
import useFetch from '../../../utils/hooks/useFetch';
import SearchResults from '../../SearchResults/SearchResults';
import { toast } from "react-toastify";
import useDebounce from '../../../utils/hooks/useDebounce';
import { SocketContext } from '../../../context/SocketProvider';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import { Player } from '../../../pages/Game/Game';

const MySwal = withReactContent(Swal);

interface IsLoggedIn {
    setIsConnected?: () => void;
}

function DynamicHeader(props: IsLoggedIn) {

    const searchInputRef = useRef<HTMLInputElement>(null);
  const socketData: any = useContext(SocketContext);
  const location = useLocation();

    const navigate = useNavigate()

    const [openMenu, setOpenMenu] = useState(false);

    const searchBarRef = useRef(null);

    const { connectedUser, setConnectedUser } = useConnectedUser();

    const [searchOpen, setSearchOpen] = useState(false);

    const searchResultsRef = useRef<HTMLDivElement>(null);

    const [searchJustOpened, setSearchJustOpened] = useState(false);

    const [search, setSearch] = useState("");

    const [justOpened, setJustOpened] = useState(false);
    
    // const dropDownButtonRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(true); 

    const [value, setValue] = useState<any>({});

    useEffect(() => {
      const searchBar: any = searchBarRef.current;
  
      if (searchOpen) {
        // HANDLE THE SEARCH BAR ON MOBILE : OPEN
        if (searchBar) {
          if (!searchBar?.classList?.contains('displayed'))
            searchBar?.classList?.add('displayed');
        }
  
        if (searchInputRef?.current) {
          searchInputRef?.current?.focus();
        }
  
        if (!searchResultsRef?.current?.classList.contains('opened')) {
          searchResultsRef?.current?.classList.add('opened');
        }
  
        if (
          !searchInputRef?.current?.parentElement?.classList?.contains('is-clicked')
        )
          searchInputRef?.current?.parentElement?.classList?.add('is-clicked');
      }
      if (!searchOpen) {

        // HANDLE THE SEARCH BAR ON MOBILE : CLOSE
        if (searchBar) {
          if (searchBar?.classList?.contains('displayed'))
            searchBar?.classList?.remove('displayed');
        }
  
        if (searchInputRef?.current) {
          searchInputRef?.current.blur();
        }
  
        if (searchResultsRef?.current?.classList.contains('opened')) {
          searchResultsRef?.current?.classList.remove('opened');
        }
  
        if (searchInputRef?.current?.parentElement?.classList?.contains('is-clicked'))
          searchInputRef?.current?.parentElement?.classList?.remove('is-clicked');
      }
    }, [searchOpen]);

    useClickOutside(searchResultsRef, () => {
      setSearchOpen(false)
    });

    useEffect(() => {
      const searchInput: any = searchInputRef.current;
      if (searchInput) {
      searchInput.addEventListener("click", () => {
          setSearchOpen((previousValue: any) => !previousValue);
          setSearchJustOpened(true);
      });
      }
    }, [searchInputRef]);

    useEffect(() => {
      //console.log('in header', socketData);
  
      socketData?.on("requestGame", (newFriendData: any) => {
          MySwal.fire({
            title: `Do you want to play with ${newFriendData?.username}?`,
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Yes",
            denyButtonText: 'No',
            allowOutsideClick: false
        }).then((result: any) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            navigate(`/game/${newFriendData?.userId}`)
            Player.emit('acceptRequest', {
              userId: connectedUser?.id,
              otherUser: newFriendData?.userId
            })
        } else if (result.isDenied) {
          Player.emit('declineRequest', {
            userId: connectedUser?.id,
            otherUser: newFriendData?.userId
          })
        }
        });
      });
    }, [connectedUser,socketData]);

    const fetchSearch = async (search: any) => {

      setLoading(true);
  
          // const tokens: any = await getTokensFromCookie();
  
          // if (!tokens) {
              // navigate("/error-page/401");
              // return ;
          // }
      
          try {
              const response = await fetch(prepareUrl(`search/${connectedUser?.id}/${search}`), { // more checks for connectedUser?.id
              method: "GET", 
              // headers: {
                  // 'access_token': tokens.access_token,
                  // 'refresh_token': tokens.refresh_token
              // },
              });
              const res = await response.json();
              if (res?.statusCode !== undefined){
                  navigate(`/error-page/${res?.statusCode}`);
                  // throw new Error('Try again, Later!');
                  return;
              }
              setValue(res);
          } catch (error) {
              toast.error('Try again, Later!')
          } finally {
              setLoading(false);
          }
  }

    useDebounce(() => {
      // const searchtrim = search.trim
      if (search  !== ""){
        fetchSearch(search);
      } else {
        setValue({});
      }
    }, 200, [search]);

    useClickOutside(searchResultsRef, () => {
        setSearchOpen(false)
    });

    const logoutFromServer = async () => {
      const gat = getCookie('access_token');
      const grt = getCookie('refresh_token');

      if (gat && grt) {

        // get the tokens
        const tokens: Tokens | null = await getTokensFromCookie();

        if (!tokens || !tokens.access_token || !tokens.refresh_token) {
          navigate("/error-page/:401");
        }

        if (tokens) {

          try {

              const url: string = prepareUrl("auth/logout/");
              
              // logout from the server
              const res = await axios.get(url, {
                headers: {
                  'access_token': tokens.access_token,
                  'refresh_token': tokens.refresh_token
                }
              })
              
              if (res.data.message === "done") {
              
                // remove tokens from the cookie
                document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";



                // set connected to false 
                if (props.setIsConnected) {
                  props.setIsConnected();
                }

                // navigate to home page
                navigate("/")
              }
              else {
                navigate("/error-page/:401");
              }
          } catch (error) {
              console.log(error);
          }
        }
        
      }

        

    }

    const updateNewUser = async (status: string) => {
      if (connectedUser) {
        
        const newDataUser: UserType = connectedUser;
        
        newDataUser.Status = status;
        
        // need to send request to server to store the new user
        const toSetUser: UserType | null =  await updateUser(newDataUser);

        if (toSetUser) {
          setConnectedUser(toSetUser);
        }
      }
    }

  if (location.pathname === '/game' || location.pathname.includes('game') || location.pathname.includes('/play/results')) return null;

    return (
      <header className="primary-header identified" data-status={connectedUser?.Status} >
        <div className="container">
          <div className="primary-header-content">
            <Link to="/profile" aria-label="home" className="logo">
              <svg
                width="84"
                height="40"
                viewBox="0 0 84 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                id="logo"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M31.1308 51.9852C31.0706 45.986 28.9865 40.0795 25.286 35.404C21.6127 30.7115 16.3763 27.2841 10.637 25.8258L11.4055 25.9275C10.9253 25.9232 10.452 25.8132 10.0195 25.6054L10.6223 25.8281C10.4241 25.7747 10.2276 25.7151 10.0332 25.6495L12.1127 20.1295C12.0979 20.1164 12.0792 20.1085 12.0594 20.1069L12.6633 20.3285C12.2757 20.1301 11.8458 20.0277 11.4101 20.0301L12.1797 20.1318C19.1483 22.0547 25.379 26.3379 29.6733 32.0545C34.0015 37.7519 36.3433 44.8895 36.265 51.9852H31.1308Z"
                  fill="#979797"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24.7059 14.501C31.3312 18.2966 36.8276 23.7734 40.6353 30.3734C44.4266 36.9175 46.3915 44.4756 46.3223 51.9851H41.1881C41.1211 45.3596 39.272 38.7997 35.8643 33.1588C32.4535 27.497 27.6013 22.833 21.7988 19.6388L24.7059 14.501Z"
                  fill="#979797"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.313 0.769775C28.5463 3.7903 38.6343 10.6396 45.6074 19.8357C49.1098 24.431 51.8317 29.5673 53.6646 35.04C55.4874 40.5041 56.4037 46.2276 56.3776 51.9852H51.2434C51.204 46.7973 50.316 41.6505 48.6144 36.747C46.9112 31.8563 44.4137 27.2771 41.2213 23.1919C38.0351 19.1123 34.2021 15.5774 29.8733 12.7264C25.5534 9.88528 20.7939 7.77068 15.7852 6.46717L17.313 0.769775Z"
                  fill="#979797"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.45811 13.2927C7.44753 12.4373 7.60765 11.5884 7.92919 10.7951C8.25074 10.0019 8.72729 9.28019 9.33119 8.67186C9.9351 8.06353 10.6543 7.58072 11.4471 7.25145C12.2399 6.92217 13.0905 6.753 13.9495 6.75375C14.8084 6.7545 15.6587 6.92515 16.4509 7.25581C17.2431 7.58646 17.9615 8.07053 18.5643 8.67991C19.1672 9.28929 19.6425 10.0118 19.9626 10.8056C20.2828 11.5994 20.4414 12.4486 20.4293 13.304C20.4053 15.0021 19.7107 16.6226 18.4958 17.8145C17.2809 19.0064 15.6435 19.6738 13.9381 19.6724C12.2327 19.6709 10.5965 19.0006 9.38371 17.8065C8.17092 16.6125 7.47913 14.9909 7.45811 13.2927ZM26.7202 10.8328C26.2576 8.44639 25.1302 6.2377 23.4667 4.45918C21.8032 2.68067 19.6709 1.4041 17.3134 0.775359C15.6632 0.329274 13.9406 0.213583 12.2452 0.434983C10.5498 0.656383 8.91542 1.21048 7.43655 2.06518C5.9511 2.91606 4.64882 4.05045 3.60433 5.40336C2.56183 6.75249 1.8018 8.29624 1.36925 9.94318C-0.440158 16.6523 3.42498 23.5841 10.0281 25.6528C10.1177 25.6879 10.2074 25.7094 10.2857 25.732C10.2971 25.7421 10.3187 25.7421 10.3414 25.7421C10.4197 25.7761 10.4969 25.7975 10.5763 25.8213H10.6092L10.6206 25.8326C10.6433 25.8428 10.6649 25.8428 10.6989 25.8428C10.7103 25.8541 10.7216 25.8541 10.7318 25.8541C10.7736 25.8755 10.8199 25.8868 10.8669 25.8868H10.8771C11.8942 26.1321 12.9227 26.2554 13.9386 26.2554C16.5085 26.2554 18.9888 25.4867 21.0786 24.1177C22.3186 23.3193 23.4079 22.3099 24.2967 21.1356C25.328 19.8023 26.0835 18.2784 26.5193 16.6523C27.0349 14.7537 27.1036 12.7622 26.7202 10.8328ZM83.9764 24.8932C80.4235 24.8593 76.8274 25.5364 73.5264 26.859C70.199 28.2063 67.1678 30.1877 64.6031 32.6921C62.0316 35.2089 59.9794 38.2023 58.5619 41.5038C57.1527 44.8218 56.4104 48.3828 56.3768 51.9852H51.2425C51.2103 47.6978 52.0233 43.4458 53.6354 39.4701C56.9326 31.4162 63.2946 24.9879 71.3333 21.5878C75.3357 19.9049 79.632 19.0241 83.9764 18.9957V24.8932Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M74.3273 16.1356C66.4631 18.1546 59.2629 22.8459 54.2581 29.2747C51.7348 32.495 49.7574 36.1046 48.4042 39.9607C47.052 43.8278 46.3483 47.8903 46.3212 51.9851H41.187C41.1483 47.3209 41.8808 42.6821 43.3551 38.2548C44.8359 33.8187 47.0357 29.6538 49.8674 25.9252C55.5158 18.4496 63.6922 12.9116 72.7994 10.4382L74.3273 16.1356Z"
                  fill="black"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M60.3209 11.1664C53.0855 15.2686 47.0529 21.1834 42.8216 28.3242C38.6035 35.438 36.3196 43.6845 36.2651 51.9853H31.1309C31.0503 42.8039 33.4431 33.5795 38.0336 25.5659C42.6515 17.4951 49.3128 10.7705 57.3536 6.0625L60.3209 11.1664Z"
                  fill="black"
                />
              </svg>
              <p className="sub-logo">Ping-ball</p>
            </Link>
            <svg
              onClick={(e) => {
                const searchBar: any = searchBarRef?.current;
                if (searchBar) {
                  searchBar.click();
                }
              }}
              className="magnifiying-glass-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                opacity="1"
                d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
              />
            </svg>
            <div
              ref={searchBarRef}
              className="search-bar"
              onClick={(e) => {
                // if(e.target.parentElement.classList.contains("is-clicked")) return;
                // e.target.parentElement.classList.add("is-clicked");
  
                setSearchOpen(true);
                setSearchJustOpened(true);
              }}
            >
              <svg
                onClick={(e) => {
                  e.stopPropagation();
                  if (searchInputRef.current)
                    searchInputRef.current.value = '';
                  setSearch('');
                  setSearchOpen(false);
                }}
                className="back-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
  
              <svg
                className="magnifiying-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  opacity="1"
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
                />
              </svg>
              <input
                ref={searchInputRef}
                className="search-input"
                type="text"
                name="search"
                placeholder="Search users, groups"
                // onKeyDown={(e) => setSearch(e.target.value)}
                onChange={(e) => setSearch(e.target.value)}
              />
              <SearchResults
                // ref={searchReseultsRef}
                results={value}
                searchOpen={searchOpen}
                searchJustOpened={searchJustOpened}
                setSearchJustOpened={setSearchJustOpened}
                setSearchOpen={setSearchOpen}
                loading={loading}
                setSearch={setSearch}
              />
            </div>
            <div
              // ref={dropDownButtonRef}
              className="user-image dropdown-button"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <img
                src={connectedUser?.avatarUrl && prepareUrl("") + connectedUser?.avatarUrl}
                alt="user image"
              />
            </div>
            <div
              className={`dropdown-menu ${openMenu ? "open" : ""}`}
            >
              <div className="dropdown-menu-content">
                <ul className="dropdown-list">
                  <li className="dropdown-item user-profile-item">
                    <div className="user-image dropdown-item-user-image">
                      <img
                        src={connectedUser?.avatarUrl && prepareUrl("") + connectedUser?.avatarUrl}
                        alt="user image"
                      />
                    </div>
                    <div className="user-infos">
                      <div className="username">
                        {connectedUser?.username}
                      </div>
                      <div className="user-status">
                        {connectedUser?.Status}
                      </div>
                    </div>
                    <select
                      className="user-edit-status"
                      name="status"
                      id="status"
                      defaultValue={connectedUser?.Status}
                      onChange={(e) => updateNewUser(e.target.value)}
                    >
                      <option value="online">Online</option>
                      <option value="busy">Busy</option>
                    </select>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/profile'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path
                            opacity="1"
                            d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">profile</div>
                    </Link>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/friends'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            opacity="1"
                            d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">friends</div>
                    </Link>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/groups'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            opacity="1"
                            d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">groups</div>
                    </Link>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to={'/chat'}>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            opacity="1"
                            d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">chat</div>
                    </Link>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/game'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            opacity="1"
                            d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">
                        play ping-pong
                      </div>
                    </Link>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/game/guest'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            opacity="1"
                            d="M480 288c-50.1 0-93.6 28.8-114.6 70.8L132.9 126.3l.6-.6 60.1-60.1c87.5-87.5 229.3-87.5 316.8 0c67.1 67.1 82.7 166.3 46.8 248.3C535.8 297.6 509 288 480 288zM113.3 151.9L354.1 392.7c-1.4 7.5-2.1 15.3-2.1 23.3c0 23.2 6.2 44.9 16.9 63.7c-3 .2-6.1 .3-9.2 .3H357c-33.9 0-66.5-13.5-90.5-37.5l-9.8-9.8c-13.1-13.1-34.6-12.4-46.8 1.7L152.2 501c-5.8 6.7-14.2 10.7-23 11s-17.5-3.1-23.8-9.4l-32-32c-6.3-6.3-9.7-14.9-9.4-23.8s4.3-17.2 11-23l66.6-57.7c14-12.2 14.8-33.7 1.7-46.8l-9.8-9.8c-24-24-37.5-56.6-37.5-90.5v-2.7c0-22.8 6.1-44.9 17.3-64.3zM480 320a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">
                        play Duo
                      </div>
                    </Link>
                  </li>
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/leaderboard'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 576 512"
                        >
                          <path
                            opacity="1"
                            fill="#1E3050"
                            d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">leaderboard</div>
                    </Link>
                  </li>
  
                  <li className="dropdown-item" onClick={() => setOpenMenu(false)}>
                    <Link to='/settings'>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            opacity="1"
                            d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">Settings</div>
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <a href="#" onClick={logoutFromServer}>
                      <div className="dropdown-item-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            opacity="1"
                            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                          />
                        </svg>
                      </div>
                      <div className="dropdown-item-title">logout</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    )

}

export default DynamicHeader
