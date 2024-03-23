import React, { useEffect } from 'react'
import Showcase from './Showcase/Showcase'
import About from './About/About'
import Team from './Team/Team'
import Header from '../../components/Header/Header'
import { LoginType, Tokens } from '../../types'
import { useNavigate } from 'react-router-dom'
import { getTokensFromCookie, prepareUrl } from '../../utils/utils'
import axios from 'axios'

function Home(props: LoginType) {

  return (
    <>
      <Showcase logInFunc={props.logInFunc} />
      <About />
      <Team />
    </>
  )
}

export default Home
