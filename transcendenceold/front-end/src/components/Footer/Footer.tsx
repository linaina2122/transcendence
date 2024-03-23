import React, {useEffect, useContext} from 'react';
import { useLocation } from 'react-router-dom';
import "./FooterStyle.css"


function Footer() {
  const location = useLocation();
  const year = new Date().getFullYear();
  if (location.pathname === '/game' || location.pathname.includes('game') || location.pathname.includes('/play/results')) return null;
  return (
    <footer>
        &copy; &nbsp; {year} &nbsp; FT_Trencendance
    </footer>
  )
}

export default Footer
