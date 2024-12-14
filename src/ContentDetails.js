import React from 'react';
import "./Row.css";
import "./Banner.css";
import "./ContentDetails.css";
import ReactDom from 'react-dom';
import Person from "./Person.js";
import ContentSmaller from "./ContentSmaller.js";
import ButtonPopup from "./ButtonPopup.js";
import AwardFor from "./AwardFor.js";
import Episode from "./Episode.js";
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

function ContentDetails(props) {

  const navigate = useNavigate();
  const [reload,setReload] = React.useState(false);

  if (reload) {
    setReload(false);
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
            "content_id":props.content_id
        })
      };
      fetch("http://localhost:3080/getfullcontent",msg)
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
  }

  function reducegenre(val) {
    let text = val;
    if (text.length>37) text=text.substr(0,34)+"...";
    return text;
  }

  function closecontentdetails(e) {
    aut.popupNo--;
    if (aut.popupNo===0) {
      document.querySelector("body").classList.remove("freeze");
    }
    if (document.getElementById("banner-video"+aut.popupNo)!=null) {
      document.getElementById("banner-video"+aut.popupNo).play();
    }
    console.log(props.reload);
    if (props.reload==false) {
      props.setReload(true);
    }
    props.setOpenPopup(false);
  }



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

  function changeseason(e) {
    console.log(e.target.value);
    let len = details.seasons.length;
    if (e.target.value==="0") {
      for (let i=1;i<=len;i++) {
        document.getElementById(aut.popupNo+"season-"+i).classList.remove("hide");
        document.getElementById(aut.popupNo+"season-title-"+i).classList.remove("hide");
      }
    }
    else {
      for (let i=1;i<=len;i++) {
        document.getElementById(aut.popupNo+"season-"+i).classList.add("hide");
        document.getElementById(aut.popupNo+"season-title-"+i).classList.add("hide");
      }
      document.getElementById(aut.popupNo+"season-"+e.target.value).classList.remove("hide");
    }
    console.log("changed");
  }

  function onchangemylistfull(e) {
    e.stopPropagation();
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
            "operation":e.target.value
        })
      };
      fetch("http://localhost:3080/changemylistfull",msg)
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
  }



  const [details,setDetails] = React.useState({"common":{"TITLE":"","LANGUAGE":"","RATING":0,"RATED_BY":0,"DESCRIPTION":"","CNAME":"","SNAME":"","DIRECTOR_ID":0,"CONTENT_TYPE":"M","TRAILER":""},"info":"","genre":"","added":false,"already_played":false,"realease_date":"","tv_network":"","awards":[],"cast":[],"seasons":[],"episodes":[],"similar_contents":[]});

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
              "content_id":props.content_id
          })
        };
        fetch("http://localhost:3080/getfullcontent",msg)
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



  if (!props.openPopup) return null;

  return ReactDom.createPortal (
    <>
    <div className="content-overlay">
    <div className="content-details-div">

      <div className="content-details">
        <div className="content-details-banner">

        {details.common.TRAILER.length>0?

          <video id={"banner-video"+aut.popupNo} className="content-details-banner-video" autoPlay="autoplay" loop>
           <source src={require(""+details.common.TRAILER)} type="video/mp4" />
           </video>


        :null}


        <div className="banner-bottom-gradient" />
        <div className="content-details-banner-content">
          <ButtonPopup already_played={details.already_played} content_id={props.content_id} extra="play" reload={reload} setReload={setReload}/>
          <button className="banner-button more-info" onClick={onchangemylistfull} value={details.added?"R":"A"}> {details.added?"Remove from My List":"Add to My List"} </button>
          <button className="content-details-banner-mute-button" id="mute1" onClick={tooglemute}>{"Mute"}</button>
        </div>
        <div className="banner-bottom-gradient" />
        </div>
        <div className="content-details-info">
          <h1> {details.common.TITLE} </h1>
          <h5>  {details.info.substr(details.info.length-6,6)==="minute"?(Math.floor(parseInt(details.info.substr(0,details.info.length-6))/60)>0?""+Math.floor(parseInt(details.info.substr(0,details.info.length-6))/60)+" hour "+(parseInt(details.info.substr(0,details.info.length-6))%60)+" minute":details.info):details.info}
          </h5>
          <p> {reducegenre(details.genre)} </p>
          <p>
          {details.common.DESCRIPTION}
          </p>
          <p> Country: {details.common.CNAME} </p>
          <p> Language: {details.common.LANGUAGE} </p>
          <p> Studio: {details.common.SNAME} </p>
          {details.tv_network.length>0?<p> TV Network: {details.tv_network} </p>:null}
          <p> Rating: {details.common.RATED_BY!=0?details.common.RATING.toFixed(1):"Not rated yet"} <span className="rating-count"> {details.common.RATED_BY!=0?"("+details.common.RATED_BY+")":null} </span> </p>
          <p> Release Date: {details.release_date} </p>
        </div>
        {details.common.CONTENT_TYPE==="T"?
        <div className="episodes-div">
          <h1> Episodes </h1>
          <select className="season-dropdown" id="season-select" name="season-select" defaultValue="1" onChange={changeseason} required>
          {
            details.seasons.map(e=>
              <option className="season-dropdown-option"  value={e.SEASON_NO} key={e.SEASON_NO}> Season {e.SEASON_NO}  </option>
          )}

            <option className="season-dropdown-option"  value="0"> Show All Episodes  </option>
          </select>

          {details.seasons.map(e=>
            <React.Fragment key={e.SEASON_NO}>
            <div className="season-title hide" id={aut.popupNo+"season-title-"+e.SEASON_NO}>
            <h2>
            Season {e.SEASON_NO}
            </h2>
            </div>
            <div className={"episode-content "+(e.SEASON_NO!=1?"hide":"")} id={aut.popupNo+"season-"+e.SEASON_NO}>
            {details.episodes.map(f=>
              (e.SEASON_NO==f.SEASON_NO?
                <Episode key={""+f.SEASON_NO+""+f.EPISODE_NO} content_id={props.content_id} SEASON_NO={f.SEASON_NO} EPISODE_NO={f.EPISODE_NO} TITLE={f.TITLE} DESCRIPTION={f.DESCRIPTION} DURATION={f.DURATION} reload={reload} setReload={setReload}/>
              :null)
            )}
            </div>
            </React.Fragment>
          )}



        </div>
        :null}
        <div className="cast-div">
          <h1> Cast </h1>
          <div className="cast-container">
          {details.cast.map(e=>
            <Person key={e.ACTOR_ID} person_id={e.ACTOR_ID} person_type="A" content_id={props.content_id} reload={reload} setReload={setReload}/>
          )}


          </div>
        </div>
        <div className="cast-div">
          <h1> Director </h1>
          <div className="cast-container">
          {details.common.DIRECTOR_ID!=0?<Person person_id={details.common.DIRECTOR_ID} person_type="D" content_id={props.content_id} reload={reload} setReload={setReload}/>:null}
          </div>
        </div>
        {details.awards.length>0?
        <div className="cast-div">
          <h1> Awards </h1>
          <div className="awards-container">
            {details.awards.map(e=>
              <div className="single-award" key={""+props.content_id+""+e.AWARD_ID}>
                <h5> {e.ANAME} </h5>
                <span> {e.YEAR} </span> &nbsp; {e.TO_NAME!=null?<>&#183;</>:null} &nbsp;
                <AwardFor to_id={e.TO_ID} to_name={e.TO_NAME} to_type={e.TO_TYPE} reload={reload} setReload={setReload}/>
                <span className="award-issue"> Issued By: {e.ISSUED_BY} </span>
              </div>

            )}

          </div>
        </div>
        :null}
        {details.similar_contents.length>0?
        <div className="cast-div">
          <h1> More like this </h1>
          <div className="content-container">
          {details.similar_contents.map(e=>
            <ContentSmaller key={e.CONTENT_ID} content_id={e.CONTENT_ID} reload={reload} setReload={setReload}/>
          )}

          </div>
        </div>
        :null}
      </div>
      <button className="content-details-close-button" onClick={closecontentdetails}> X </button>
    </div>
    </div>
    </>,
    document.getElementById("popup")
  );
}

export default ContentDetails;
