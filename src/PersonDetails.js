import React from 'react';
import "./Row.css";
import "./Banner.css";
import "./ContentDetails.css";
import ReactDom from 'react-dom';
import Person from "./Person.js";
import ContentSmaller from "./ContentSmaller.js";
import AwardFor from "./AwardFor.js";
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

function PersonDetails(props) {

  const navigate = useNavigate();
  const [reload,setReload] = React.useState(false);

  if (reload) {
    console.log("reloading person");
    setReload(false);
  }

  function closepersondetails(e) {
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

  const [details,setDetails] = React.useState({"common":{"PNAME":"","DATE_OF_BIRTH":"","HEIGHT":null,"DESCRIPTION":"","IMAGE":"","COVER_IMAGE":"","CNAME":""},"contents":[],"awards":[]});

  React.useEffect(()=>{

      if (props.person_id>0 && props.person_type!=null) {

      aut.sessionId = Cookies.get("netflix");
      if (aut.sessionId!=null) {
        let msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json',
                    'Authorization': aut.sessionId
            },
          body: JSON.stringify({
              "profile_id":aut.profileId,
              "person_id":props.person_id,
              "person_type":props.person_type
          })
        };
        fetch("http://localhost:3080/getfullperson",msg)
          .then(res => res.json())
            .then(data => {
              console.log(data);
              if (data.status) {
                if (data.subscriptionStatus) {
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
      <div className="person-details-div">
        <div className="person-details">
        <div className="person-top-div">
          {details.common.COVER_IMAGE.length>0?<img className="person-cover-image" src={require(""+details.common.COVER_IMAGE)} alt="person-cover" />:null}

          <div className="person-profile-image-div">
            {details.common.IMAGE.length>0?<img className="person-profile-image" src={require(""+details.common.IMAGE)} alt="person-profile" />:null}

          </div>
        </div>
        <div className="person-name-div">
          <h1> {details.common.PNAME} </h1>
        </div>

        <div className="person-info-div">
          <p> {details.common.DESCRIPTION}
          </p>
          <p> Born: {details.common.DATE_OF_BIRTH} </p>
          {props.person_type==="A"?<p> Height: {details.common.HEIGHT} </p>:null}
          <p> Country: {details.common.CNAME} </p>
        </div>
        {details.awards.length>0?
        <div className="cast-div">
          <h1> Awards </h1>
          <div className="awards-container">
            {details.awards.map(e=>
            <div className="single-award" key={""+e.TO_ID+""+e.AWARD_ID}>
              <h5> {e.ANAME} </h5>
              <span> {e.YEAR} </span> &nbsp; {e.TO_NAME!=null?<>&#183;</>:null} &nbsp;
              <AwardFor to_id={e.TO_ID} to_name={e.TO_NAME} to_type={e.TO_TYPE} reload={reload} setReload={setReload}/>
              <span className="award-issue"> Issued By: {e.ISSUED_BY} </span>
            </div>
            )}
          </div>
        </div>
        :null}
        <div className="cast-div">
          <h1> Movies and TV shows </h1>
          <div className="content-container">
            {details.contents.map(e=>
              <ContentSmaller key={e.CONTENT_ID} content_id={e.CONTENT_ID} reload={reload} setReload={setReload}/>
            )}
          </div>
        </div>

        </div>
        <button className="content-details-close-button" onClick={closepersondetails}> X </button>
      </div>
    </div>
    </>,
    document.getElementById("popup")
  );
}

export default PersonDetails;
