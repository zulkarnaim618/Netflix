import React from 'react';
import "./ContentDetails.css";
import ReactDom from 'react-dom';
import {aut} from "./App.js";
import PersonDetails from "./PersonDetails.js";
import ContentDetails from "./ContentDetails.js";
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

function AwardFor(props) {

  const navigate = useNavigate();
  const [openPopup,setOpenPopup] = React.useState(false);

  function onawardforinfo(e) {
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
    <span className="award-for" onClick={onawardforinfo}> {props.to_name} </span>
    {openPopup?(props.to_type==="C"?<ContentDetails openPopup={openPopup} setOpenPopup={setOpenPopup} content_id={props.to_id} reload={props.reload} setReload={props.setReload}/>
    :<PersonDetails openPopup={openPopup} setOpenPopup={setOpenPopup} person_id={props.to_id} person_type={props.to_type} reload={props.reload} setReload={props.setReload}/>):null
    }
    </>
  );
}

export default AwardFor;
