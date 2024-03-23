import React, { useEffect, useRef, useState } from 'react';
import useClickOutside from '../../utils/hooks/useClickOutside';
import CardItem from '../card-item/CardItem';
import './SearchResultStyle.css';
import { Link } from 'react-router-dom';
import { prepareUrl } from '../../utils/utils';
import { useNavigate } from "react-router-dom";

const SearchResults: React.FC<any> = ({
  results,
  searchOpen,
  searchJustOpened,
  setSearchJustOpened,
  setSearchOpen,
  loading,
  setSearch,
}) => {
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useClickOutside(searchResultsRef, () => {
    // CHECK IF THE MODAL JUST OPENED
    if (searchJustOpened) {
      setSearchJustOpened(false);
      return;
    }
    if (searchOpen) setSearchOpen(false);
  });

  useEffect(() => {
    const searchResults = searchResultsRef.current;
    const list = searchResults?.children[0]?.children[0]?.children;
    const searchResultsLength = list?.length;
    if (searchResults && searchResultsLength! > 0) {
      for (let i = 0; i < searchResultsLength!; i++) {
        if (list && list[i]) { // hadi makantsh
          list[i]?.addEventListener('click', () => {
            if (searchResults.classList.contains('opened'))
              searchResults.classList.remove('opened');
            if (searchResults?.parentElement?.classList?.contains('is-clicked'))
              searchResults?.parentElement?.classList?.remove('is-clicked');
            if (searchResults.parentElement) {
              if (searchResults.parentElement.querySelector('input') !== null){
                searchResults.parentElement.querySelector('input')!.value = ''; // changed from input = '' to .remove()
              }
            } 
          });
        }
      }
    }
  }, [searchResultsRef, results]);

  //useEffect(() => {
  //  console.log('results', results);
  //}, [results]);

  // console.log('opened', searchOpen);

  return (
    <div
      className={`search-results ${searchOpen ? 'opened' : ''}`}
      ref={searchResultsRef}
    >
      <div className="search-results-content scrollbar">
        {loading && <div className="loading"></div>}
        {!loading &&
          searchResultsRef?.current?.parentElement?.querySelector('input')?.value === '' && (
            <div className="tap-on-search">Tap something on the search bar</div>
          )}
        {!loading &&
          results?.users?.length === 0 &&
          results?.groups?.length === 0 && (
            <div className="search-results-empty">No users or groups found</div>
          )}
        {!loading &&
          (results?.users?.length > 0 || results?.groups?.length > 0) && (
            <ul>
              {results?.users &&
                results?.users.map((user: any, index: any) => {
                  const key = `key-${index}`;
                  return (
                    <li key={key}>
                      <Link
                        to={`/profile/${user?.id}`}
                        
                        onClick={() => {
                          if (searchResultsRef.current) {
                            const searchBar =
                              searchResultsRef.current.parentElement;

                            if (searchBar?.classList?.contains('displayed'))
                              searchBar?.classList?.remove('displayed');
                          }
                          setSearch('');
                          setSearchOpen(false);
                          setSearchJustOpened(false);
                        }}
                        className="card-link"
                      >  
                        {/* <CardItem data={user} type="user" /> */}
                        <div className="search-card">
                          <div className="search-card-body">
                            <div className="search-card-infos">
                              <div className="search-card-images">
                                {user?.images?.map((image: any, index: any) => (
                                  <img
                                    key={`key-${index}`}
                                    src={prepareUrl(image)}
                                    alt="person avatar"
                                  />
                                ))}
                              </div>
                              <div className="search-card-description">
                                <div className="search-card-name">
                                  {user?.name}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-link-type">user</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              {results?.groups &&
                results?.groups.map((group: any, index: any) => {
                  const key = `key-${index}`;

                  return (
                    <li key={key}>
                      <Link
                        to={`/group/${group?.id}`}
                        onClick={() => {
                          if (searchResultsRef.current) {
                            const searchBar =
                              searchResultsRef.current.parentElement;
                            if (searchBar?.classList.contains('displayed'))
                              searchBar?.classList.remove('displayed');
                          }
                          setSearch('');
                          setSearchOpen(false);
                          setSearchJustOpened(false);
                        }}
                        className="card-link"
                      >
                        {/* <CardItem data={group} type="group" /> */}
                        <div className="search-card">
                          <div className="search-card-body">
                            <div className="search-card-infos">
                              <div className="search-card-images">
                                {group?.images?.map((image: any, index: any) => (
                                  <img
                                    key={`key-${index}`}
                                    src={prepareUrl(image)}
                                    alt="person avatar"
                                  />
                                ))}
                              </div>
                              <div className="search-card-description">
                                <div className="search-card-name">
                                  {group?.name}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-link-type">group</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
            </ul>
          )}
      </div>
    </div>
  );
};

export default SearchResults;

// import React, { useEffect, useRef, useState } from 'react'
// import { Link } from 'react-router-dom';
// import { SearchTypeComp } from '../../types';
// import "./SearchResultStyle.css"
// import useClickOutside from '../../utils/hooks/useClickOutside';
// import { useConnectedUser } from '../../context/ConnectedContext';

// function SearchResults(props: SearchTypeComp) {

//   const searchResultsRef = useRef<HTMLDivElement | null>(null);

//   const { connectedUser } = useConnectedUser()
 
//   const [noInput, setNoInput] = useState<boolean>(false);

//   useClickOutside(searchResultsRef, () => {
//     // CHECK IF THE MODAL JUST OPENED
//     if (props.searchJustOpened) {
//       props.setSearchJustOpened(false);
//       return;
//     }
//     if (props.searchOpen) props.setSearchOpen(false);
//   });

//   useEffect(( ) => {
//     if (searchResultsRef?.current && searchResultsRef?.current.parentElement) {
//       if (searchResultsRef?.current.parentElement.querySelector("input")?.value === "") {
//         setNoInput(true);
//       }
//     }
//   }, [])

//   // useEffect(() => {
//   //   const searchResults = searchResultsRef.current;
//   //   if (searchResults) {

//   //     const list = searchResults.children[0].children[0].children
//   //     const searchResultsLength = list.length;
//   //      if (searchResults && searchResultsLength > 0) {
//   //        for (let i = 0; i < searchResultsLength; i++) {
//   //          list[i].addEventListener('click', () => {
            
//   //            if (searchResults.classList.contains('opened')) searchResults.classList.remove('opened')
//   //            if (searchResults.parentElement && searchResults.parentElement.classList.contains('is-clicked')) searchResults.parentElement.classList.remove('is-clicked');
             
//   //           //  if (searchResults) {

//   //           //    searchResults?.parentElement.querySelector("input")?.value = ""
//   //           //  }
             
//   //          })
           
//   //        }
//   //      }
//   //   }
//   // }, [searchResultsRef, props.results])

//   return (
//     <div
//       className={`search-results ${props.searchOpen ? "opened" : ""}`}
//       ref={searchResultsRef}
//     >
//       <div className="search-results-content scrollbar">
//         {props.loading && <div className="loading"></div>}

//         {!props.loading &&  ( noInput && <div className="tap-on-search">Tap something on the search bar</div>)}
        
//         {!props.loading && (props.results?.users?.length === 0 && props.results?.groups?.length === 0) && <div className="search-results-empty">No users or groups found</div>}
        
//         {!props.loading && ( props.results &&  ( props.results?.users?.length > 0 || props.results?.groups?.length > 0 ))  && <ul>
        
//           {props.results?.users &&
//             props.results?.users.map((user: any, index: any) => {
//               const key = `key-${index}`;
//               return (
//                 <li key={key}>
//                   <Link to={`/profile/${user?.id}`} onClick={() => {
//                     props.setSearch(""); 
//                     props.setSearchOpen(false) 
//                     }} className="card-link">
//                     {/* <CardItem data={user} type="user" /> */}
//                     <div className="search-card">
//                       <div className="search-card-body">
//                         <div className="search-card-infos">
//                           <div className="search-card-images">
//                             {user?.images?.map((image: any, index: any) => (
//                               <img key={`key-${index}`} src={process.env.PUBLIC_URL + image} alt="person avatar" />
//                             ))}
//                           </div>
//                           <div className="search-card-description">
//                             <div className="search-card-name">
//                               {user?.name}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     <div className="card-link-type">user</div>
//                     </div>
//                   </Link>
//                 </li>
//               );
//             })}
//           {props.results?.groups &&
//             props.results?.groups.map((group: any, index: any) => {
//               const key = `key-${index}`;

//               return (
//                 <li key={key}>
//                   <Link to={`/group/${group?.id}`} onClick={() => {
//                       props.setSearch(""); 
//                       props.setSearchOpen(false)
//                     }}  className="card-link">
//                     <div className="search-card">
//                       <div className="search-card-body">
//                         <div className="search-card-infos">
//                           <div className="search-card-images">
//                             {group?.images?.map((image: string, index: number) => (
//                               <img key={`key-${index}`} src={process.env.PUBLIC_URL + image} alt="person avatar" />
//                             ))}
//                           </div>
//                           <div className="search-card-description">
//                             <div className="search-card-name">
//                               {group?.name}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     <div className="card-link-type">group</div>
//                     </div>
//                   </Link>
//                 </li>
//               );
//             })}
//         </ul>}
//       </div>
//     </div>
//   );
// }

// export default SearchResults
