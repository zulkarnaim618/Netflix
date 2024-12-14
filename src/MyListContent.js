import React from 'react';
import "./Browse.css";
import ContentS from "./ContentS.js";
import Genre from "./Genre.js";
import AddGenre from "./AddGenre.js";
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

function MyListContent(props) {

  const navigate = useNavigate();

  const [contents,setContents] = React.useState({"movies":[],"tvseries":[],"genre":[]});
  const [reload,setReload] = React.useState(false);
  const [openGenrePopup,setOpenGenrePopup] = React.useState(false);

  function addgenre(e) {
    if (aut.popupNo===0) {
      document.querySelector("body").classList.add("freeze");
    }
    setOpenGenrePopup(true);
    aut.popupNo++;
  }


  if (reload) {
    setReload(false);
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId
        })
      };
      fetch("http://localhost:3080/getmylistcontent",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setContents(data.details);
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

  React.useEffect(()=>{
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId
        })
      };
      fetch("http://localhost:3080/getmylistcontent",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setContents(data.details);
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
    <div className="mylist-content">
    {contents.movies.length>0?
      <>
      <h2> Movies  </h2>
      {contents.movies.map(e=>
        <ContentS key={e.CONTENT_ID} content_id={e.CONTENT_ID} reload={reload} setReload={setReload}/>
      )}
      </>
      :null
    }
    {contents.tvseries.length>0?
      <>
      <h2> TV Series  </h2>
      {contents.tvseries.map(e=>
        <ContentS key={e.CONTENT_ID} content_id={e.CONTENT_ID} reload={reload} setReload={setReload}/>
      )}
      </>
      :null
    }
    <>
    <h2> Preference  </h2>
      {contents.genre.map(e=>
        <Genre key={e.GENRE_ID} genre_id={e.GENRE_ID} name={e.NAME} reload={reload} setReload={setReload}/>
      )}
      <div className="genre-div add-genre" onClick={addgenre}> <h4> + </h4> </div>
    </>
    </div>
    {openGenrePopup?<AddGenre openGenrePopup={openGenrePopup} setOpenGenrePopup={setOpenGenrePopup} reload={reload} setReload={setReload}/>:null}
    </>
  );
}

export default MyListContent;
