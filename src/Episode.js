import React from 'react';
import "./ContentDetails.css";
import "./Row.css";
import "./Banner.css";
import ReactDom from 'react-dom';
import {aut} from "./App.js";
import PersonDetails from "./PersonDetails.js";
import ContentDetails from "./ContentDetails.js";
import Play from "./Play.js";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
  useNavigate
} from 'react-router-dom';
import Cookies from 'js-cookie';

function Episode(props) {

  const navigate = useNavigate();
  const [openPlayPopup,setOpenPlayPopup] = React.useState(false);

  function oncontentplay(e) {

    if (aut.popupNo===0) {
      document.querySelector("body").classList.add("freeze");
    }

    if (document.getElementById("banner-video"+aut.popupNo)!=null) {

      document.getElementById("banner-video"+aut.popupNo).pause();
    }

    setOpenPlayPopup(true);
    aut.popupNo++;

  }



  return (
    <>
    <div className="single-episode" onClick={oncontentplay}>
      <table>
        <tbody>
          <tr>
            <td className="episode-number"> <h1> {props.EPISODE_NO} </h1> </td>
            <td className="episode-thumbnail">
              <img className="episode-thumbnail-image" src={require("./image/video-thumbnail.png")} />
            </td>
            <td className="episode-details">
              <h5> {props.TITLE} </h5>
              <p> {props.DESCRIPTION} </p>
              <span className="episode-duration"> {(Math.floor(props.DURATION/3600)>0?""+Math.floor(props.DURATION/3600)+" hour "+Math.floor((props.DURATION%3600)/60)+" minute":""+Math.floor((props.DURATION%3600)/60)+" minute")} </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    {openPlayPopup?<Play openPlayPopup={openPlayPopup} setOpenPlayPopup={setOpenPlayPopup} content_id={props.content_id} season_no={props.SEASON_NO} episode_no={props.EPISODE_NO} reload={props.reload} setReload={props.setReload}/>:null}
    </>
  );
}

export default Episode;
