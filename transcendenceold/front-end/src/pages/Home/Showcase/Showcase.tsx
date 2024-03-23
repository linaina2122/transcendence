import React from 'react'
import "./ShowcaseStyle.css"
import { LoginType } from '../../../types'


function Showcase(props: LoginType) {
  return (
    <section className="showcase">
      <br />
      <div className="container">
        <div className="showcase-content">
          <div className="showcase-text">
            <h2 className="showcase-message">
              Your first real time <br className='line' />
              Ping-Pong
            </h2>
            <p className="showcase-description">
              This is the ft_trancendance project for 1337 school, it is
              faithfull to the 1769 Ping Pong ball game, we wish you all the
              best in your journey with our Ping Ball game, have fun!
            </p>
            <div className="showcase-buttons">
              {/* <Link path="/login">Login with intra</Link> */}
              <button
                onClick={props.logInFunc}
                className="button"
              >Login with intra</button>
            </div>
          </div>
          <div className="showcase-images">
            <div className="ball-image"></div>
            <div className="paddle-image"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Showcase
