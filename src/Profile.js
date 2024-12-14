import React from 'react';
import "./Profile.css";
import "./Home.css";
import netflix_logo from "./image/homeScreen_logo.png";
import profile_avatar from "./image/profile-avatar.png";
import profile_add from "./image/profile-add.png";
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

let profileClicked=0;

function Profile (props) {
  console.log("profile");
  const [profile,setProfile] = React.useState([]);
  const [accountName,setAccountName] = React.useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    submitLogoutRequest(navigate);
  }

  React.useEffect(() => {
    aut.sessionId = Cookies.get("netflix");
    console.log("authenticating");
    console.log(aut.sessionId);
    console.log((aut.sessionId!=null));
    if (aut.sessionId!=null) {
      let msg = {
        method: 'GET',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          }
      };
      fetch("http://localhost:3080/authenticate",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                msg = {
                  method: 'GET',
                  headers: {'Content-Type': 'application/json',
                            'Authorization': aut.sessionId
                    }
                };
                fetch("http://localhost:3080/getprofile",msg)
                  .then(res => res.json())
                    .then(data => {
                      console.log(data);
                      if (data.status) {
                        setProfile(data.profile);
                        setAccountName(data.accountname);
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
    else {
      aut.sessionId = 0;
      aut.status = false;
      aut.subStatus = false;
      navigate("/login");
    }
  }, []);

  function onPopupClose() {
    document.getElementById("pin-popup").classList.remove("pin-popup-show");
    document.getElementById("profile-body-div").classList.remove("profile-body-div-hide");
    document.getElementById("add-profile-popup").classList.remove("add-profile-popup-show");
  }

  function createProfile(e) {
    e.preventDefault();
    
    let name = document.getElementById("profileName").value;
    let pin = document.getElementById("pin1").value+document.getElementById("pin2").value+document.getElementById("pin3").value+document.getElementById("pin4").value;
    pin=Number(pin);
    const msg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'Authorization': aut.sessionId
        },
      body: JSON.stringify({
          "name": name,
          "pin": pin,
      })
    };
    fetch("http://localhost:3080/createprofile",msg)
      .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status) {
            aut.status = true;
            if (data.profileStatus) {
              aut.profileId = data.profile_id;
              navigate("/browse/home");
            }
            else {
              aut.profileId = 0;
              //if not success
            }

          }
          else {
            Cookies.remove("netflix");
            aut.sessionId = 0;
            aut.status = false;
            navigate("/login");
          }
        });
  }

  function checkVal(e) {
    let len=e.target.name.length;
    if (!((e.key>=0 && e.key<=9) || e.keyCode==8 || e.keyCode==46)) {
      e.preventDefault();
    }
    else if (e.key>=0 && e.key<=9) {
      e.preventDefault();
      if (e.target.name.substr(len-1,1)!="4") {

        //console.log(e.target.name.substr(0,5)+String(Number(e.target.name.substr(5,1))+1));
        e.target.value=e.key;
        document.getElementById(e.target.name.substr(0,len-1)+String(Number(e.target.name.substr(len-1,1))+1)).focus();
      }
      else {
        e.target.value=e.key;
        if (e.target.name.substr(0,len-1)==="digit") {
          let pin = document.getElementById("digit1").value+document.getElementById("digit2").value+document.getElementById("digit3").value+document.getElementById("digit4").value;
          pin=Number(pin);
          const msg = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                      'Authorization': aut.sessionId
              },
            body: JSON.stringify({
                "profile_id": profileClicked,
                "pin": pin,
            })
          };
          fetch("http://localhost:3080/verifyprofile",msg)
            .then(res => res.json())
              .then(data => {
                console.log(data);
                if (data.status) {
                  aut.status = true;
                  if (data.profileStatus) {
                    aut.profileId = data.profile_id;
                    navigate("/browse/home");
                  }
                  else {
                    aut.profileId = 0;
                    document.getElementById("pin-error").innerHTML = "Wrong PIN. Please try again";
                    document.getElementById("pin-error").style.color = "red";
                    setTimeout(function() {
                      if (document.getElementById("pin-error")!=null) {
                        document.getElementById("pin-error").style.color = "white";
                        document.getElementById("pin-error").innerHTML = "Enter your PIN to access this profile";
                      }
                    },4000);
                  }
                }
                else {
                  Cookies.remove("netflix");
                  aut.sessionId = 0;
                  aut.staus = false;
                }
              });
        }

      }
    }
    else if (e.keyCode==8) {
      e.preventDefault();
      if (e.target.name.substr(len-1,1)!="1") {
        e.target.value="";
        document.getElementById(e.target.name.substr(0,len-1)+String(Number(e.target.name.substr(len-1,1))-1)).focus();
      }
      else {
        e.target.value="";
      }
    }
  }

  return (
    <div className="profile">


      <div className="profile-body-div" id="profile-body-div">
        <div className="profile-body-form">
          <h1> Who's watching? </h1>
          <div className="profile-container">
            {profile.map(e =>
              <ProfileCard key={e.PROFILE_ID} profile_id={e.PROFILE_ID} name={e.NAME}/>
            )}
            <CreateProfileCard/>
          </div>
        </div>
      </div>
      <div className="pin-popup" id="pin-popup">
        <button className="pin-popup-button" onClick={onPopupClose}> X </button>
        <h1 id="pin-error"> Enter your PIN to access this profile </h1>
        <input type="text" name="digit1" id="digit1" onKeyDown={checkVal}/>
        <input type="text" name="digit2" id="digit2" onKeyDown={checkVal}/>
        <input type="text" name="digit3" id="digit3" onKeyDown={checkVal}/>
        <input type="text" name="digit4" id="digit4" onKeyDown={checkVal}/>
      </div>
      <div className="add-profile-popup" id="add-profile-popup">
        <button className="pin-popup-button" onClick={onPopupClose}> X </button>
        <div className="add-profile-popup-container">
          <h1> Add profile </h1>
          <form onSubmit={createProfile}>
          <div className="add-profile-popup-body">
            <img
              name="avatar"
              className="profile-avatar"
              src={profile_avatar}
              alt="profile-avatar"
            />
            <input type="text" name="profileName" id="profileName" placeholder="Name" maxLength="10" required/>
          </div>
          <h4> PIN </h4>
          <input type="text" name="pin1" id="pin1" onKeyDown={checkVal} required/>
          <input type="text" name="pin2" id="pin2" onKeyDown={checkVal} required/>
          <input type="text" name="pin3" id="pin3" onKeyDown={checkVal} required/>
          <input type="text" name="pin4" id="pin4" onKeyDown={checkVal} required/><br/>
          <button type="submit" className="profile-create-button"> Create </button>
          </form>
        </div>
      </div>

      <div className="profile-top-div">
        <img
          className="profile-top-netflix-logo"
          src={netflix_logo}
          alt="netflix-logo"
        />


        <div className="profile-top-div-gradient"/>
      </div>

      <div className="dropdown">
        <ul>
          <li>
            <h3> {accountName} </h3>
            <ul>
              <li> <h6 onClick={()=>{navigate("/account");}}> Account </h6> </li>
              <li> <h6 onClick={onLogout}> Log out </h6> </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}

function ProfileCard(props) {

  function profileClick(e) {
    profileClicked=e.target.id;
    document.getElementById("pin-popup").classList.add("pin-popup-show");
    document.getElementById("profile-body-div").classList.add("profile-body-div-hide");
    document.getElementById("digit1").value="";
    document.getElementById("digit2").value="";
    document.getElementById("digit3").value="";
    document.getElementById("digit4").value="";
    document.getElementById("digit1").focus();
  }

  return (
    <div className="profile-card">
      <div className="profile-card-container">
        <img
          name="avatar"
          id={props.profile_id}
          className="profile-avatar"
          src={profile_avatar}
          alt="profile-avatar"
          onClick={profileClick}
        />
        <h4> {props.name} </h4>
      </div>
    </div>
  );
}

function CreateProfileCard(props) {

  function createProfileClick(e) {
    document.getElementById("add-profile-popup").classList.add("add-profile-popup-show");
    document.getElementById("profile-body-div").classList.add("profile-body-div-hide");
    document.getElementById("pin1").value="";
    document.getElementById("pin2").value="";
    document.getElementById("pin3").value="";
    document.getElementById("pin4").value="";
    document.getElementById("profileName").value="";
  }

  return (
    <div className="profile-card">
      <div className="profile-card-container">
        <img
          name="avatar"
          id="profile-avatar"
          className="profile-avatar"
          src={profile_add}
          alt="profile-avatar"
          onClick={createProfileClick}
        />
        <h4> Add </h4>
      </div>
    </div>
  );
}

export default Profile;
