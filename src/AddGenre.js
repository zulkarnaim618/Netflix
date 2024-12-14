import React from 'react';
import "./Browse.css";
import "./Row.css";
import "./ContentDetails.css";
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

function AddGenre(props) {

  const navigate = useNavigate();

  function closegenre(e) {
    aut.popupNo--;

    if (aut.popupNo===0) {
      document.querySelector("body").classList.remove("freeze");
    }

    if (props.reload==false) {
      props.setReload(true);
    }
    props.setOpenGenrePopup(false);
  }

  const [genre,setGenre] = React.useState([]);

  React.useEffect(()=> {
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
      fetch("http://localhost:3080/getgenre",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setGenre(data.genre);
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

  function onaddgenre(e) {
    e.preventDefault();
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
                  'Authorization': aut.sessionId
          },
        body: JSON.stringify({
            "profile_id":aut.profileId,
            "genre_id":e.target.genre.value
        })
      };
      fetch("http://localhost:3080/addtopreference",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                if (data.profileStatus) {
                  setGenre(data.genre);
                  document.getElementById("add-genre-msg").classList.remove("genre-msg-hide");
                  setTimeout(function() {
                    if (document.getElementById("add-genre-msg")!=null) {
                      document.getElementById("add-genre-msg").classList.add("genre-msg-hide");
                    }
                  },4000);
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

  if (!props.openGenrePopup) return null;

  return ReactDom.createPortal (
    <>
    <div className="content-overlay">
      <div className="add-genre-div">
      {genre.length>0?
        <>
          <h1> Add to Preference </h1>
          <div id="add-genre-msg" className="add-genre-msg genre-msg-hide"> Successfully Added </div>
          <form onSubmit={onaddgenre}>
          <select className="genre-select" name="genre" defaultValue="" required>
            <option value=""  disabled hidden>Select genre</option>
            {genre.map(e=>
              <option key={e.GENRE_ID} value={e.GENRE_ID}> {e.NAME} </option>
            )}
          </select>
          <br/>
          <button className="review-submit-button" type="submit"> Add </button>
          </form>
        </>:
        <h1> Nothing left to add </h1>
      }
        <button className="content-details-close-button" onClick={closegenre}> X </button>
      </div>
    </div>
    </>,
    document.getElementById("popup")
  );
}

export default AddGenre;
