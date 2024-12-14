import React from 'react';
import "./Browse.css";
import "./Home.css";
import "./Profile.css";
import "./Banner.css";
import netflix_logo from "./image/homeScreen_logo.png";
import profile_avatar from "./image/profile-avatar.png";
import profile_add from "./image/profile-add.png";
import Nav from "./Nav.js";
import Banner from "./Banner.js";
import Row from "./Row.js";
import SearchContent from "./SearchContent.js";
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

function BrowseTV(props) {
  const navigate = useNavigate();
  console.log("browse");


  const [showSearchResult,setShowSearchResult] = React.useState(false);
  const [profileName,setProfileName] = React.useState("");
  const [banner,setBanner] = React.useState(0);
  const [searchContent,setSearchContent] = React.useState([]);
  const [reload,setReload] = React.useState(false);
  const [rowTitle,setRowTitle] = React.useState([]);

  React.useEffect(()=>{
    window.scrollTo(0, 0);
    aut.sessionId = Cookies.get("netflix");
    console.log("authenticating");
    console.log(aut.sessionId);
    console.log((aut.sessionId!=null));
    console.log("logging session id"+aut.sessionId);
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
            console.log(aut.sessionId);
            if (data.status) {
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                console.log("next step");
                console.log(aut.sessionId);
                msg = {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json',
                            'Authorization': aut.sessionId
                    },
                  body: JSON.stringify({
                      "profile_id":aut.profileId,
                      "space":"tv"
                  })
                };
                fetch("http://localhost:3080/browseinfo",msg)
                  .then(res => res.json())
                    .then(data => {
                      console.log(data);
                      if (data.status) {
                        if (data.subscriptionStatus) {
                          if (data.profileStatus) {
                            setProfileName(data.profile_name);
                            setBanner(data.content_id);
                            setRowTitle(data.rowTitle);
                          }
                          else {
                            console.log("not sending to profile");
                            aut.profileId = 0;
                            navigate("/profile");
                          }
                        }
                        else {
                          aut.subStatus = false;
                          navigate("/subscribe");
                        }
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

  },[]);


  return (
    <div className="browse" >

      <Nav selected="tv" showSearchResult={showSearchResult} setShowSearchResult={setShowSearchResult} profileName={profileName} searchContent={searchContent} setSearchContent={setSearchContent}/>
      {!showSearchResult?
        <>
      {banner>0?
      <Banner content_id={banner}/>:
      <div className="banner" />
      }

      <div className="browse-row-div">
      {
        rowTitle.map(e =>
          <Row key={e.ID} id={e.ID} space="tv" query={e.TITLE} reload={reload} setReload={setReload}/>
        )
      }
      </div>
      </>:
      <div className="search-result-div">
        <SearchContent selected="tv" searchContent={searchContent} setSearchContent={setSearchContent}/>
      </div>
    }



    </div>
  );
}

export default BrowseTV;
