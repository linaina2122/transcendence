import React from 'react'
import "./AboutStyle.css"

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <h1 className="about-title">About the game</h1>
          <div className="about-core">
            <div className="about-img">
              <img src="/images/table.svg" alt="table" />
            </div>
            <p className="about-description">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nulla
              tempore, blanditiis doloribus, quod distinctio harum laboriosam
              quia ducimus quo, reprehenderit dignissimos ex cupiditate aperiam!
              Iusto minima necessitatibus, amet sapiente inventore magni ratione
              facere blanditiis et, cumque aliquid quisquam unde deserunt
              laudantium dolores! Distinctio atque ut facilis laudantium
              voluptatem! Totam non, mollitia cumque, reiciendis porro, magnam
              id recusandae sit vel itaque suscipit explicabo consectetur
              voluptatum laudantium magni iusto fugiat earum quas omnis saepe.
              Doloremque possimus a ipsa deserunt accusantium dolorum ullam!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
