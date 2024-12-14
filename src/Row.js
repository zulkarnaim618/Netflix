import React from 'react';
import "./Row.css";
import profile_avatar from "./image/profile-avatar.png";
import Content from "./Content.js";
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

function Row(props) {

  const navigate = useNavigate();


  React.useEffect(()=>{
    console.log("continueing");
    if (props.reload && props.query==="continue") {
    props.setReload(false);
    console.log("continueing again");
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "space":props.space,
            "query": props.query
        })
      };
      fetch("http://localhost:3080/getrowcontent",msg)
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
  },[props.reload]);

  function onscrollleft(e) {
    let len = e.target.id.length;
    document.getElementById(e.target.id.substr(0,len-2)).scrollBy({left:-800,behavior:"smooth"});
  }

  function onscrollright(e) {
    let len = e.target.id.length;
    document.getElementById(e.target.id.substr(0,len-2)+"bl").style.display = "block";
    document.getElementById(e.target.id.substr(0,len-2)).scrollBy({left:800,behavior:"smooth"});
  }

  const [details,setDetails] = React.useState({"title":"","contentList":[]});

  React.useEffect(()=>{
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "space":props.space,
            "query": props.query
        })
      };
      fetch("http://localhost:3080/getrowcontent",msg)
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

  },[]);

  return (
    <>
    {details.contentList.length>0?
    <div className="row">
      <h2> {details.title} </h2>
      <div className="row-content-wrapper">
        <div className="row-content" id={props.id}>
        {details.contentList.map(e=>
          <Content key={e.CONTENT_ID} content_id={e.CONTENT_ID} reload={props.reload} setReload={props.setReload}/>

        )}

        </div>
        <button className="row-scroll-button-left" id={props.id+"bl"} onClick={onscrollleft}>&lt;</button>
        <button className={details.contentList.length<6?"row-scroll-button-right row-scroll-button-right-hide":"row-scroll-button-right"} id={props.id+"br"} onClick={onscrollright}>&gt;</button>
      </div>
    </div>
    :null}
    </>
  );
}

export default Row;
