import React from 'react';
import "./Row.css";
import profile_avatar from "./image/profile-avatar.png";
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
import {aut} from "./App.js";

function ContentSmaller(props) {

  const navigate = useNavigate();

  const [openPopup,setOpenPopup] = React.useState(false);
  const [openPlayPopup,setOpenPlayPopup] = React.useState(false);

  function reducegenre(val) {
    let text = val;
    if (text.length>37) text=text.substr(0,34)+"...";
    return text;
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

  function oncontentplay(e) {
    e.stopPropagation();
    if (aut.popupNo===0) {
      document.querySelector("body").classList.add("freeze");
    }
    if (document.getElementById("banner-video"+aut.popupNo)!=null) {
      document.getElementById("banner-video"+aut.popupNo).pause();
    }
    setOpenPlayPopup(true);
    aut.popupNo++;
  }

  function onchangemylist(e) {
    e.stopPropagation();
    console.log(e.target.value);
    if (props.content_id>0) {
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "content_id":props.content_id,
            "operation":e.target.value
        })
      };
      fetch("http://localhost:3080/changemylist",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setDetails(data.details);

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
  }

  function oncontenthover(e) {
    console.log("content hovered");
    if (props.content_id>0) {
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
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
      fetch("http://localhost:3080/getshortcontent",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setDetails(data.details);

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
  }

  const [details,setDetails] = React.useState({"image":"","info":"","genre":"","added":false,"already_played":false});

  React.useEffect(()=>{
    if (props.content_id>0) {
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
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
      fetch("http://localhost:3080/getshortcontent",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setDetails(data.details);

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

  },[]);

  return (
    <>
    <div className="search-content-wrapper">
    <div className="smaller-content-div" onClick={oncontentinfo} onMouseEnter={oncontenthover}>
      {details.image.length>0?
      <img
        className="row-content-div-img"
        src={require(""+details.image)}
        alt="content"
      />:
      null}
      <div className="row-content-div-details">
        <div className="content-info"> {details.info.substr(details.info.length-6,6)==="minute"?(Math.floor(parseInt(details.info.substr(0,details.info.length-6))/60)>0?""+Math.floor(parseInt(details.info.substr(0,details.info.length-6))/60)+" hour "+(parseInt(details.info.substr(0,details.info.length-6))%60)+" minute":details.info):details.info}
        </div>
        <div className="content-genre"> {reducegenre(details.genre)}
        </div>
        <div className="content-button-div">
          <button className="content-button" onClick={oncontentplay}> {details.already_played?"Resume":"Play"} </button>
          <button className="content-button" onClick={onchangemylist} value={details.added?"R":"A"}> {details.added?"Remove from My List":"Add to My List"} </button>

        </div>
      </div>
    </div>
    </div>
    {openPopup?<ContentDetails openPopup={openPopup} setOpenPopup={setOpenPopup} content_id={props.content_id} reload={props.reload} setReload={props.setReload}/>:null}
    {openPlayPopup?<Play openPlayPopup={openPlayPopup} setOpenPlayPopup={setOpenPlayPopup} content_id={props.content_id} season_no={0} episode_no={0} reload={props.reload} setReload={props.setReload}/>:null}
    </>
  );
}

export default ContentSmaller;
