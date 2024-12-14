import React from 'react';
import "./Banner.css";
import ButtonPopup from "./ButtonPopup.js";
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
import {aut} from "./App.js";

function Banner(props) {
  const navigate = useNavigate();

  //const [contentId,setContentId] = React.useState(props.content_id);

  //setContentId(props.content_id);
  const [reload,setReload] = React.useState(false);

  function tooglemute(e) {
    if (e.target.innerHTML === "Mute") {
      e.target.innerHTML = "Unmute";
      document.getElementById("banner-video"+aut.popupNo).muted = true;
    }
    else {
      e.target.innerHTML = "Mute";
      document.getElementById("banner-video"+aut.popupNo).muted = false;
    }
  }

  if (reload) {
    setReload(false);
    if (props.content_id>0) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "content_id":props.content_id
        })
      };
      console.log(msg);
      console.log("banner");
      fetch("http://localhost:3080/getbannercontent",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  console.log(data.content_details);
                  setBannerData(data.content_details);
                }
                else {
                  aut.profileId = 0;
                  navigate("/profile");
                }

              }
              else {
                //setSubStatus(false);
                console.log(aut);
                aut.status = true;
                aut.subStatus = false;
                navigate("/subscribe");
              }
              //setAuth(true);


            }
            else {
              Cookies.remove("netflix");
              aut.sessionId = 0;
              //setSubStatus(false);
              //setAuth(false);
              aut.status = false;
              aut.subStatus = false;
              navigate("/login");
            }
          });

    }
  }

  const [bannerData,setBannerData] = React.useState({"TITLE":"","DESCRIPTION":"","TRAILER":"","already_played":false});



  React.useEffect(()=>{
    console.log("inside banner");
    console.log("fetching"+props.content_id);
    if (props.content_id>0) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "content_id":props.content_id
        })
      };
      console.log(msg);
      console.log("banner");
      fetch("http://localhost:3080/getbannercontent",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  console.log(data.content_details);
                  setBannerData(data.content_details);
                }
                else {
                  aut.profileId = 0;
                  navigate("/profile");
                }

              }
              else {
                //setSubStatus(false);
                console.log(aut);
                aut.status = true;
                aut.subStatus = false;
                navigate("/subscribe");
              }
              //setAuth(true);


            }
            else {
              Cookies.remove("netflix");
              aut.sessionId = 0;
              //setSubStatus(false);
              //setAuth(false);
              aut.status = false;
              aut.subStatus = false;
              navigate("/login");
            }
          });

    }
  },[]);

  return (
    <div className="banner">
      <video id={"banner-video"+aut.popupNo} className="banner-video" autoPlay="autoplay" loop>
        {bannerData.TRAILER.length>0?<source src={require(""+bannerData.TRAILER)} type="video/mp4" />:null}
      </video>
      <div className="banner-content">
        <h1 className="banner-title"> {bannerData.TITLE} </h1>
        <p className="banner-description"> {bannerData.DESCRIPTION} </p>
        <ButtonPopup already_played={bannerData.already_played} content_id={props.content_id} extra="play" reload={reload} setReload={setReload}/>
        <ButtonPopup already_played={bannerData.already_played} content_id={props.content_id} extra="more-info" reload={reload} setReload={setReload}/>
        <button className="banner-mute-button" id="mute" onClick={tooglemute}>{"Mute"}</button>
      </div>
      <div className="banner-bottom-gradient" />
    </div>
  );
}

export default Banner;
