import React from 'react';
import "./Browse.css";
import ContentS from "./ContentS.js";
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

function SearchContent(props) {

  const navigate = useNavigate();

  const [reload,setReload] = React.useState(false);

  if(reload) {
    setReload(false);
    let val = document.getElementById("search").value;
    console.log(val);
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
    <div className="search-content">
    <div className="search-title"> Results for  </div>
    {
      props.searchContent.length>0?
        props.searchContent.map(e=>
          <ContentS key={e.CONTENT_ID} content_id={e.CONTENT_ID} reload={reload} setReload={setReload}/>
        )
      :
      <h1 className="search-empty"> Nothing found </h1>
    }
    </div>
  );
}

export default SearchContent;
