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

function ButtonPopup(props) {

  const navigate = useNavigate();
  const [openPopup,setOpenPopup] = React.useState(false);
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

  function oncontentinfo(e) {
    if (aut.popupNo===0) {
      document.querySelector("body").classList.add("freeze");
    }
    if (document.getElementById("banner-video"+aut.popupNo)!=null) {
      document.getElementById("banner-video"+aut.popupNo).pause();
    }
    setOpenPopup(true);
    aut.popupNo++;
  }



  return (
    <>
    {props.extra==="play"?<button className="banner-button play" onClick={oncontentplay}> {props.already_played?"Resume":"Play"} </button>
    :<button className="banner-button more-info" onClick={oncontentinfo}> {"More info"} </button>}
    {openPopup?<ContentDetails openPopup={openPopup} setOpenPopup={setOpenPopup} content_id={props.content_id} reload={props.reload} setReload={props.setReload}/>:null}
    {openPlayPopup?<Play openPlayPopup={openPlayPopup} setOpenPlayPopup={setOpenPlayPopup} content_id={props.content_id} season_no={0} episode_no={0} reload={props.reload} setReload={props.setReload}/>:null}
    </>
  );
}

export default ButtonPopup;
