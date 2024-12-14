import React from 'react';
import "./Browse.css";
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

function Genre(props) {

  const navigate = useNavigate();

  function removegenre(e) {
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "genre_id":props.genre_id
        })
      };
      fetch("http://localhost:3080/removefrompreference",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  props.setReload(true);
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

  return (
    <div className="genre-div">
     <h4> {props.name} </h4>
     <button className="genre-remove-button" onClick={removegenre}> X </button>
     </div>
  );
}

export default Genre;
