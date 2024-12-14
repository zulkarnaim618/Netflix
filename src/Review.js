import React from 'react';
import "./ContentDetails.css";
import "./Row.css";
import ReactDom from 'react-dom';
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

function Review(props) {

  const navigate = useNavigate();


  function closereview(e) {
    aut.popupNo--;

    if (aut.popupNo===0) {
      document.querySelector("body").classList.remove("freeze");
    }

    if (document.getElementById("banner-video"+aut.popupNo)!=null) {

      document.getElementById("banner-video"+aut.popupNo).play();
    }

    props.setOpenPopup(false);
  }

  let value = 0;

  function starselected(e) {
    let num = parseInt(e.target.id.substr(e.target.id.length-1,1));
    for (let i=1;i<=5;i++) {
      document.getElementById("star-"+i).innerHTML ="&#10032;";
      document.getElementById("star-"+i).style.color = "white";
      document.getElementById("star-"+i).addEventListener("mouseenter",()=>{
        document.getElementById("star-"+i).innerHTML ="&#10032;";
        document.getElementById("star-"+i).style.color = "#bbbbbb";
      });
      document.getElementById("star-"+i).addEventListener("mouseleave",()=>{
        document.getElementById("star-"+i).innerHTML ="&#10032;";
        document.getElementById("star-"+i).style.color = "white";
      });
    }
    for (let i=1;i<=num;i++) {
      document.getElementById("star-"+i).innerHTML ="&#9733;";
      document.getElementById("star-"+i).style.color = "gold";
      document.getElementById("star-"+i).addEventListener("mouseenter",()=>{
        document.getElementById("star-"+i).innerHTML ="&#10032;";
        document.getElementById("star-"+i).style.color = "#bbbbbb";
      });
      document.getElementById("star-"+i).addEventListener("mouseleave",()=>{
        document.getElementById("star-"+i).innerHTML ="&#9733;";
        document.getElementById("star-"+i).style.color = "gold";
      });
    }
    value = num;
  }

  function onreviewsubmit(e) {
    if (value>0) {
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
              "rating":value
          })
        };
        fetch("http://localhost:3080/submitreview",msg)
          .then(res => res.json())
            .then(data => {
              console.log(data);
              if (data.status) {
                if (data.subscriptionStatus) {
                  //setSubStatus(true);
                  aut.status = true;
                  aut.subStatus = true;
                  if (data.profileStatus) {
                    closereview(e);
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
    else {
      document.getElementById("select-star").classList.remove("select-star-hide");
      setTimeout(function() {
        if (document.getElementById("select-star")!=null) {
          document.getElementById("select-star").classList.add("select-star-hide");
        }
      },4000);
    }
  }


  if (!props.openPopup) return null;

  return ReactDom.createPortal (
    <>
    <div className="content-overlay">
      <div className="review-div">
        <h1> {"How was "+props.name+"?"} </h1>
        <div className="select-star select-star-hide" id="select-star"> Please select star first</div>
        <div className="review-star-div">
        <span className="review-star" id="star-1" onClick={starselected}>&#10032;</span>
        <span className="review-star" id="star-2" onClick={starselected}>&#10032;</span>
        <span className="review-star" id="star-3" onClick={starselected}>&#10032;</span>
        <span className="review-star" id="star-4" onClick={starselected}>&#10032;</span>
        <span className="review-star" id="star-5" onClick={starselected}>&#10032;</span>
        </div>
        <button className="review-submit-button" onClick={onreviewsubmit}> Submit </button>
        <button className="content-details-close-button" onClick={closereview}> X </button>
      </div>
    </div>
    </>,
    document.getElementById("popup")
  );
}

export default Review;
