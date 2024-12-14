import React from 'react';
import "./ContentDetails.css";
import "./Banner.css";
import "./"
import ReactDom from 'react-dom';
import Review from "./Review.js";
import ReactPlayer from 'react-player';
import {aut} from "./App.js";
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

function Play(props) {

  const navigate = useNavigate();
  const videoRef = React.useRef();

  const [openPopup,setOpenPopup] = React.useState(false);

  function onreview(e) {
    if (aut.popupNo===0) {
      document.querySelector("body").classList.add("freeze");
    }
    if (document.getElementById("banner-video"+aut.popupNo)!=null) {
      document.getElementById("banner-video"+aut.popupNo).pause();
    }
    setOpenPopup(true);
    aut.popupNo++;
  }


  function closeplay(e) {
    aut.popupNo--;

    if (aut.popupNo===0) {
      document.querySelector("body").classList.remove("freeze");
    }

    if (document.getElementById("banner-video"+aut.popupNo)!=null) {

      document.getElementById("banner-video"+aut.popupNo).play();
    }
    if (props.reload==false) {
      props.setReload(true);
    }
    props.setOpenPlayPopup(false);
  }

  const [details,setDetails] = React.useState({"title":"","video":"","seek_time":0,"season_no":0,"episode_no":0});
  const [nextDetails,setNextDetails] = React.useState({"title":"","video":"","seek_time":0,"season_no":0,"episode_no":0});

  React.useEffect(()=>{
      console.log("autpopup "+aut.popupNo);
      if (props.content_id!=null) {

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
              "season_no":props.season_no,
              "episode_no":props.episode_no
          })
        };
        fetch("http://localhost:3080/getplayvideo",msg)
          .then(res => res.json())
            .then(data => {
              console.log(data);
              if (data.status) {
                if (data.subscriptionStatus) {
                  //setSubStatus(true);
                  aut.status = true;
                  aut.subStatus = true;
                  if (data.profileStatus) {
                    console.log(data.details);
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

  function fixseek() {
      videoRef.current.seekTo(details.seek_time, 'seconds');
  }

  function submitprogress(e) {

    let play_time = videoRef.current.getCurrentTime();
    if (props.content_id!=null) {

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
            "season_no":details.season_no,
            "episode_no":details.episode_no,
            "play_time":play_time
        })
      };
      fetch("http://localhost:3080/submitplayprogress",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {

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

  const [name,setName] = React.useState("");

  function requestreview(e) {
    if (props.content_id!=null) {

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
            "season_no":details.season_no,
            "episode_no":details.episode_no
        })
      };
      fetch("http://localhost:3080/checkreviewstatus",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setName(data.details.name);
                  if (!data.details.reviewdone) {
                    onreview(e);
                  }
                  if (data.details.nextStatus) {
                    document.getElementById("next-button").style.visibility = "visible";
                    setNextDetails(data.details.nextDetails);
                  }
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

  function onend(e) {
    submitprogress(e);
    requestreview(e);
  }



  function onnext(e) {
    document.getElementById("next-button").style.visibility = "hidden";
    setDetails(nextDetails);
    videoRef.current.seekTo(nextDetails.seek_time, 'seconds');
  }

  function onseek(e) {
    document.getElementById("next-button").style.visibility = "hidden";
    submitprogress(e);
  }


  if (!props.openPlayPopup) return null;

  return ReactDom.createPortal (
    <>
    <div className="content-overlay">
      <div className="play-div">
        {details.video.length>0?
        <ReactPlayer ref={videoRef} width="100%" height="100%" url={require(""+details.video)} type="video/mp4" playing controls onEnded={onend} onStart={fixseek} onSeek={onseek} progressInterval={10000} onProgress={submitprogress}/>
        :null}
        <div className="play-top-gradient">
        <div className="play-title-div"> {details.title} </div>
        <button className="content-details-close-button" onClick={closeplay}> X </button>
        </div>
        <button id="next-button" className="banner-mute-button next-button" onClick={onnext}> Next </button>
      </div>
    </div>
    {openPopup?<Review openPopup={openPopup} setOpenPopup={setOpenPopup} name={name} content_id={props.content_id}/>:null}
    </>,
    document.getElementById("popup")
  );
}

export default Play;
