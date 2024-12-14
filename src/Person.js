import React from 'react';
import "./ContentDetails.css";
import ReactDom from 'react-dom';
import {aut} from "./App.js";
import PersonDetails from "./PersonDetails.js";
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

function Person(props) {

  const navigate = useNavigate();
  const [openPopup,setOpenPopup] = React.useState(false);

  function onpersoninfo(e) {
    if (aut.popupNo===0) {
      document.querySelector("body").classList.add("freeze");
    }
    if (document.getElementById("banner-video"+aut.popupNo)!=null) {
      document.getElementById("banner-video"+aut.popupNo).pause();
    }
    setOpenPopup(true);
    aut.popupNo++;
  }

  const [details,setDetails] = React.useState({"name":"","image":"","character_name":""});


  React.useEffect(()=>{
      console.log("content"+props.content_id);
      console.log("personid"+props.person_id);
      console.log("persontype"+props.person_type);
      if (props.person_id>0 && props.content_id!=null && props.person_type!=null) {
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
              "person_id":props.person_id,
              "person_type":props.person_type
          })
        };
        fetch("http://localhost:3080/getshortperson",msg)
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

  return (
    <>
    <div className="person" onClick={onpersoninfo}>
      {details.image.length>0?<img className="person-image" src={require(""+details.image)} alt="person" />:null}
      <div className="person-name"> {details.name.length>18?details.name.substr(0,15)+"...":details.name} </div>
      <div className="person-role"> {details.character_name.length>21?details.character_name.substr(0,18)+"...":details.character_name} </div>
    </div>
    {openPopup?<PersonDetails openPopup={openPopup} setOpenPopup={setOpenPopup} person_id={props.person_id} person_type={props.person_type} reload={props.reload} setReload={props.setReload}/>:null}

    </>
  );
}

export default Person;
