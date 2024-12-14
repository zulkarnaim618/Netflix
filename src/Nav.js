import React from 'react';
import "./Nav.css";
import "./Dropdown.css";
import netflix_logo from "./image/homeScreen_logo.png";
import profile_avatar from "./image/profile-avatar.png";
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
import {aut,submitLogoutRequest} from "./App.js";

function Nav(props) {

  const [showNav,setShowNav] = React.useState(false);
  const navigate = useNavigate();

  const onLogout = () => {
    submitLogoutRequest(navigate);
  }

  function transitionNav () {
    if (window.scrollY>0) {
      setShowNav(true);
    }
    else {
      setShowNav(false);
    }
  }

  function movetolink(e) {
    navigate("/browse/"+e.target.id);
  }

  function dosearch(e) {

    let val = e.target.value;
    console.log(val);
    if (val.length>0) {
      props.setShowSearchResult(true);
      aut.sessionId = Cookies.get("netflix");
      if (aut.sessionId!=null) {
        let msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json',
                    'Authorization': aut.sessionId
            },
          body: JSON.stringify({
              "profile_id":aut.profileId,
              "space":props.selected,
              "value":val
          })
        };
        fetch("http://localhost:3080/getsearchcontent",msg)
          .then(res => res.json())
            .then(data => {
              console.log(data);
              if (data.status) {
                if (data.subscriptionStatus) {
                  //setSubStatus(true);
                  aut.status = true;
                  aut.subStatus = true;
                  if (data.profileStatus) {
                    props.setSearchContent(data.contents);
                    //props.setShowSearchResult(true);
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
    else {
      props.setShowSearchResult(false);
    }
  }

  React.useEffect(()=> {
    console.log(props.selected);
    document.getElementById(props.selected).classList.add("selected");
    window.addEventListener("scroll",transitionNav);
    return () => window.removeEventListener("scroll",transitionNav);
  }, []);

  return (
    <div className={`nav-div  ${showNav && "nav-black"}`}>
      <div className="nav-div-content-gradient"/>
      <div className="nav-div-content">
        <img
          className="nav-netflix-img"
          src={netflix_logo}
          alt="netflix-logo"
        />
        <div className="nav-link-div">
        <button id="home" className="nav-link-button" onClick={movetolink}> Home </button>
        <button id="tv" className="nav-link-button" onClick={movetolink}> TV Shows </button>
        <button id="movie" className="nav-link-button" onClick={movetolink}> Movies </button>
        <button id="mylist" className="nav-link-button" onClick={movetolink}> My List </button>
        </div>
        <div className="nav-search">
          <input id="search" type="text" name="search" className="search-input" placeholder="Search title, people, genre, studio etc." onKeyUp={dosearch}/>
        </div>

        <div className="dropdown nav-dropdown">
          <ul>
            <li>
              <img
                className="nav-avatar-img"
                src={profile_avatar}
                alt="avatar"
              />
              <h3> {props.profileName} </h3>
              <ul>
                <li> <h6 onClick={()=> {aut.profileId=0;navigate("/profile");}}> Change profile </h6> </li>
                <li> <h6 onClick={()=>{navigate("/account");}}> Account </h6> </li>
                <li> <h6 onClick={onLogout}> Log out </h6> </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>


    </div>
  );
}


export default Nav;
