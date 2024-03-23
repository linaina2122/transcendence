import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
import "./SpinnerStyle.css"



function Spinner() {
  return (
    <div className="centered-div" >
      <BeatLoader
        color="#200E15"
        cssOverride={{}}
      />
    </div>
  )
}

export default Spinner
