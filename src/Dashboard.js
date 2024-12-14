import React from 'react';
import "./Profile.css";
import "./Home.css";
import "./Dashboard.css";
import "./Account.css";
import "./ContentDetails.css";
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
import {adminaut} from "./App.js";


function Dashboard(props) {

  const navigate = useNavigate();

  function onLogout(props) {
    adminaut.admin_id="";
    adminaut.password="";
    navigate("/admin");
  }

  const [data,setData] = React.useState({"stat":{"dailyuser":0,"monthlyuser":0,"dailyrevenue":0,"monthlyrevenue":0},"country":[],"language":[],"studio":[],"tvnetwork":[],"genre":[],"award":[],"actor":[],"director":[],"content":[],"series":[]});

  React.useEffect(() => {
    if (adminaut.admin_id!="" && adminaut.password!="") {
      const msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            "admin_id": adminaut.admin_id,
            "password": adminaut.password,
        })
      };
      fetch("http://localhost:3080/dashboardinfo",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              setData(data.data);

            }
            else {
              adminaut.admin_id="";
              adminaut.password="";
              navigate("/admin");
            }
          });


    }
    else {
      navigate("/admin");
    }

  }, []);

  function changediv(e) {
    let val = document.getElementsByClassName("add-div");
    let side = document.getElementsByClassName("side-bar-single-div");
    for (let i=0;i<val.length;i++) {
      val[i].classList.add("add-div-hidden");
      side[i].classList.remove("clicked");
    }
    document.getElementById(e.target.id).classList.add("clicked");
    document.getElementById(e.target.id+"-div").classList.remove("add-div-hidden");
  }

  function onadd(e) {
    e.preventDefault();
    if (adminaut.admin_id!="" && adminaut.password!="") {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            "admin_id": adminaut.admin_id,
            "password": adminaut.password,
            "space":""
        })
      };
      let space = e.target.id.substr(0,e.target.id.length-9);
      if (space==="country" || space==="language" || space==="genre" || space==="studio" || space==="tv_network") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "name":e.target[space].value
          })
        };
      }
      else if (space==="award") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "name":e.target[space].value,
              "issuedby":e.target.issuedby.value
          })
        };
      }
      else if (space==="similar-contents") {
        if (e.target.content1.value===e.target.content2.value) {
          document.getElementById(space+"-add-msg").style.color = "red";
          document.getElementById(space+"-add-msg").innerHTML = "Same content";
          setTimeout(function() {
            if (document.getElementById(space+"-add-msg")!=null) {
              document.getElementById(space+"-add-msg").innerHTML = "";
            }
          },3000);
          return;
        }
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content1":e.target.content1.value,
              "content2":e.target.content2.value
          })
        };
      }
      else if (space==="content-genre") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content":e.target.content.value,
              "genre":e.target.genre.value
          })
        };
      }
      else if (space==="acted") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content":e.target.content.value,
              "actor":e.target.actor.value,
              "charactername":e.target.charactername.value
          })
        };
      }
      else if (space==="episodes") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content":e.target.content.value,
              "seasonno":e.target.seasonno.value,
              "episodeno":e.target.episodeno.value,
              "title":e.target.title.value,
              "duration":e.target.duration.value,
              "releasedate":e.target.releasedate.value,
              "video":e.target.video.value,
              "description":e.target.description.value.substr(0,200)
          })
        };
      }
      else if (space==="content-received") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content":e.target.content.value,
              "award":e.target.award.value,
              "receiveddate":e.target.receiveddate.value
          })
        };
      }
      else if (space==="actor-received") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content":e.target.content.value,
              "award":e.target.award.value,
              "actor":e.target.actor.value,
              "receiveddate":e.target.receiveddate.value
          })
        };
      }
      else if (space==="director-received") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "content":e.target.content.value,
              "award":e.target.award.value,
              "director":e.target.director.value,
              "receiveddate":e.target.receiveddate.value
          })
        };
      }
      else if (space==="actor") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "name":e.target.name.value,
              "dob":e.target.dob.value,
              "height":e.target.height.value,
              "image":e.target.profileimage.value,
              "coverimage":e.target.coverimage.value,
              "country":e.target.country.value,
              "description":e.target.description.value.substr(0,200)
          })
        };
      }
      else if (space==="director") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "name":e.target.name.value,
              "dob":e.target.dob.value,
              "image":e.target.profileimage.value,
              "coverimage":e.target.coverimage.value,
              "country":e.target.country.value,
              "description":e.target.description.value.substr(0,200)
          })
        };
      }
      else if (space==="content") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "title":e.target.ctitle.value,
              "image":e.target.cimage.value,
              "trailer":e.target.ctrailer.value,
              "language":e.target.language.value,
              "country":e.target.country.value,
              "studio":e.target.studio.value,
              "director":e.target.director.value,
              "description":e.target.cdescription.value.substr(0,200),
              "type":e.target.ctype.value,
              "mvideo":(e.target.ctype.value==="M"?e.target.mvideo.value:""),
              "mduration":(e.target.ctype.value==="M"?e.target.mduration.value:""),
              "mreleasedate":(e.target.ctype.value==="M"?e.target.mreleasedate.value:""),
              "ttvnetwork":(e.target.ctype.value==="T"?e.target.ttvnetwork.value:""),
              "tstartdate":(e.target.ctype.value==="T"?e.target.tstartdate.value:""),
              "tenddate":(e.target.ctype.value==="T"?e.target.tenddate.value:"")
          })
        };
      }
      fetch("http://localhost:3080/addinfo",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.errorStatus) {
                document.getElementById(space+"-add-msg").style.color = "red";
                document.getElementById(space+"-add-msg").innerHTML = "Invalid relation";
                setTimeout(function() {
                  if (document.getElementById(space+"-add-msg")!=null) {
                    document.getElementById(space+"-add-msg").innerHTML = "";
                  }
                },3000);
              }
              else if (data.changeStatus) {
                document.getElementById(space+"-add-msg").style.color = "green";
                document.getElementById(space+"-add-msg").innerHTML = "Successfully added";
                setTimeout(function() {
                  if (document.getElementById(space+"-add-msg")!=null) {
                    document.getElementById(space+"-add-msg").innerHTML = "";
                  }
                },3000);
                setData(data.data);
              }
              else {
                document.getElementById(space+"-add-msg").style.color = "red";
                document.getElementById(space+"-add-msg").innerHTML = "Already exists";
                setTimeout(function() {
                  if (document.getElementById(space+"-add-msg")!=null) {
                    document.getElementById(space+"-add-msg").innerHTML = "";
                  }
                },3000);


              }


            }
            else {
              adminaut.admin_id="";
              adminaut.password="";
              navigate("/admin");
            }
          });

    }
    else {
      navigate("/admin");
    }
  }

  function onedit(e) {
    e.preventDefault();
    if (adminaut.admin_id!="" && adminaut.password!="") {
      let msg = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'
          },
        body: JSON.stringify({
            "admin_id": adminaut.admin_id,
            "password": adminaut.password,
            "space":""
        })
      };
      let space = e.target.id.substr(0,e.target.id.length-10);
      if (space==="country" || space==="language" || space==="genre" || space==="studio" || space==="tv_network") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "id":e.target[space+"_id"].value,
              "name":e.target[space].value,
              "deletename":e.target["delete"+space].checked
          })
        };
      }
      else if (space==="award") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "id":e.target[space+"_id"].value,
              "name":e.target[space].value,
              "issuedby":e.target.issuedby.value,
              "deletename":e.target["delete"+space].checked
          })
        };
      }
      else if (space==="actor" || space==="director") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "id":e.target[space+"_id"].value,
              "name":e.target.name.value,
              "dob":e.target.dob.value,
              "height":(space==="actor"?e.target.height.value:0),
              "image":e.target.profileimage.value,
              "coverimage":e.target.coverimage.value,
              "country":e.target.country.value,
              "description":e.target.description.value,
              "deletename":e.target["delete"+space].checked
          })
        };
      }
      else if (space==="content") {
        msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "id":e.target[space+"_id"].value,
              "title":e.target.ctitle.value,
              "image":e.target.cimage.value,
              "trailer":e.target.ctrailer.value,
              "language":e.target.language.value,
              "country":e.target.country.value,
              "studio":e.target.studio.value,
              "director":e.target.director.value,
              "description":e.target.cdescription.value.substr(0,200),
              "type":e.target.ctypeedit.value,
              "mvideo":(e.target.ctypeedit.value==="M"?e.target.mvideo.value:""),
              "mduration":(e.target.ctypeedit.value==="M"?e.target.mduration.value:""),
              "mreleasedate":(e.target.ctypeedit.value==="M"?e.target.mreleasedate.value:""),
              "ttvnetwork":(e.target.ctypeedit.value==="T"?e.target.ttvnetwork.value:""),
              "tstartdate":(e.target.ctypeedit.value==="T"?e.target.tstartdate.value:""),
              "tenddate":(e.target.ctypeedit.value==="T"?e.target.tenddate.value:""),
              "deletename":e.target["delete"+space].checked
          })
        };
      }
      fetch("http://localhost:3080/editinfo",msg)
        .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status) {
              if (data.changeStatus) {
                document.getElementById(space+"-edit-msg").style.color = "green";
                document.getElementById(space+"-edit-msg").innerHTML = "Successfully updated";
                setTimeout(function() {
                  if (document.getElementById(space+"-edit-msg")!=null) {
                    document.getElementById(space+"-edit-msg").innerHTML = "";
                  }
                },3000);
                setData(data.data);
              }
              else {
                document.getElementById(space+"-edit-msg").style.color = "red";
                document.getElementById(space+"-edit-msg").innerHTML = "Already exists";
                setTimeout(function() {
                  if (document.getElementById(space+"-edit-msg")!=null) {
                    document.getElementById(space+"-edit-msg").innerHTML = "";
                  }
                },3000);


              }

            }
            else {
              adminaut.admin_id="";
              adminaut.password="";
              navigate("/admin");
            }
          });

    }
    else {
      navigate("/admin");
    }
  }

  function notinlist(e) {
    document.getElementById(e.target.id.substr(0,e.target.id.length-5)).click();
  }

  function changecontenttype(e) {
    if (e.target.name==="ctype") {
      document.getElementById("movie-add").classList.add("content-type-hide");
      document.getElementById("tv-add").classList.add("content-type-hide");
      if (e.target.value=="M") {
        document.getElementById("movie-add").classList.remove("content-type-hide");
      }
      else {
        document.getElementById("tv-add").classList.remove("content-type-hide");
      }
    }
    else if (e.target.name==="ctypeedit") {
      document.getElementById("movie-edit").classList.add("content-type-hide");
      document.getElementById("tv-edit").classList.add("content-type-hide");
      if (e.target.value=="M") {
        document.getElementById("movie-edit").classList.remove("content-type-hide");
      }
      else {
        document.getElementById("tv-edit").classList.remove("content-type-hide");
      }
    }
  }

  function onselectchange(e) {
    document.getElementById(e.target.id+"-div").classList.remove("selected-none");
    if (document.getElementById(e.target.id+"-input")!=null) document.getElementById(e.target.id+"-input").value = e.target.options[e.target.selectedIndex].text;
    let space = e.target.id.substr(0,e.target.id.length-7);
    if (space==="award" || space==="actor" || space==="director" || space==="content") {
      if (adminaut.admin_id!="" && adminaut.password!="") {

        let msg = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'
            },
          body: JSON.stringify({
              "admin_id": adminaut.admin_id,
              "password": adminaut.password,
              "space":space,
              "id":e.target.value
          })
        };
        fetch("http://localhost:3080/getinfo",msg)
          .then(res => res.json())
            .then(data => {
              console.log(data);
              if (data.status) {
                if (space==="award") {
                  document.getElementById(e.target.id+"-input").value = data.data.NAME;
                  document.getElementById(e.target.id+"-issuedby-input").value = data.data.ISSUED_BY;
                }
                else if (space==="actor") {
                  document.getElementById(e.target.id+"-name-input").value = data.data.NAME;
                  document.getElementById(e.target.id+"-dob-input").value = data.data.DATE_OF_BIRTH;
                  document.getElementById(e.target.id+"-height-input").value = data.data.HEIGHT;
                  document.getElementById(e.target.id+"-description-input").value = data.data.DESCRIPTION;
                  document.getElementById(e.target.id+"-image-input").value = data.data.IMAGE;
                  document.getElementById(e.target.id+"-coverimage-input").value = data.data.COVER_IMAGE;
                  document.getElementById(e.target.id+"-country-input").value = data.data.COUNTRY_ID;
                }
                else if (space==="director") {
                  document.getElementById(e.target.id+"-name-input").value = data.data.NAME;
                  document.getElementById(e.target.id+"-dob-input").value = data.data.DATE_OF_BIRTH;
                  document.getElementById(e.target.id+"-description-input").value = data.data.DESCRIPTION;
                  document.getElementById(e.target.id+"-image-input").value = data.data.IMAGE;
                  document.getElementById(e.target.id+"-coverimage-input").value = data.data.COVER_IMAGE;
                  document.getElementById(e.target.id+"-country-input").value = data.data.COUNTRY_ID;
                }
                else if (space==="content") {
                  document.getElementById(e.target.id+"-title-input").value = data.data.TITLE;
                  document.getElementById(e.target.id+"-image-input").value = data.data.IMAGE;
                  document.getElementById(e.target.id+"-trailer-input").value = data.data.TRAILER;
                  document.getElementById(e.target.id+"-language-input").value = data.data.LANGUAGE_ID;
                  document.getElementById(e.target.id+"-country-input").value = data.data.COUNTRY_ID;
                  document.getElementById(e.target.id+"-studio-input").value = data.data.STUDIO_ID;
                  document.getElementById(e.target.id+"-director-input").value = data.data.DIRECTOR_ID;
                  document.getElementById(e.target.id+"-description-input").value = data.data.DESCRIPTION;
                  if (data.data.CONTENT_TYPE==="M") {
                    document.getElementById(e.target.id+"-typem-input").click();
                    if (data.subdata!=null) {
                      document.getElementById(e.target.id+"-mvideo-input").value = data.subdata.VIDEO;
                      document.getElementById(e.target.id+"-mduration-input").value = data.subdata.DURATION;
                      document.getElementById(e.target.id+"-mreleasedate-input").value = data.subdata.RELEASE_DATE;
                    }
                  }
                  else if (data.data.CONTENT_TYPE==="T") {
                    document.getElementById(e.target.id+"-typet-input").click();
                    if (data.subdata!=null) {
                      document.getElementById(e.target.id+"-ttvnetwork-input").value = data.subdata.TV_NETWORK_ID;
                      document.getElementById(e.target.id+"-tstartdate-input").value = data.subdata.START_DATE;
                      document.getElementById(e.target.id+"-tenddate-input").value = data.subdata.END_DATE;
                    }
                  }
                }

              }
              else {
                adminaut.admin_id="";
                adminaut.password="";
                navigate("/admin");
              }
            });

      }
      else {
        navigate("/admin");
      }
    }
  }

  function checkVal(e) {
    if (!((e.key>=0 && e.key<=9) || e.keyCode==8 || e.keyCode==46 || e.keyCode==37 || e.keyCode==39)) {
      e.preventDefault();
    }

  }

  return (
    <div className="account">
      <div className="account-top-div">
          <img
            className="account-top-netflix-logo"
            src={netflix_logo}
            alt="netflix-logo"
          />
          <div className="dropdown account-dropdown">
            <ul>
              <li>
                <h3> {adminaut.admin_id} </h3>
                <ul>
                  <li> <h6 onClick={onLogout}> Log out </h6> </li>
                </ul>
              </li>
            </ul>
          </div>

      </div>

      <div className="dashboard-body-div">
        <div className="side-bar">
          <div id="statistics" className="side-bar-single-div clicked" onClick={changediv}> Statistics </div>
          <div id="country" className="side-bar-single-div" onClick={changediv}>Country </div>
          <div id="language" className="side-bar-single-div" onClick={changediv}>Language </div>
          <div id="genre" className="side-bar-single-div" onClick={changediv}>Genre </div>
          <div id="studio" className="side-bar-single-div" onClick={changediv}>Studio </div>
          <div id="tv_network" className="side-bar-single-div" onClick={changediv}>TV Network </div>
          <div id="actor" className="side-bar-single-div" onClick={changediv}>Actor </div>
          <div id="director" className="side-bar-single-div" onClick={changediv}>Director </div>
          <div id="award" className="side-bar-single-div" onClick={changediv}>Award </div>
          <div id="content" className="side-bar-single-div" onClick={changediv}>Content </div>
          <div id="content-details" className="side-bar-single-div" onClick={changediv}>Content Details </div>
        </div>
        <div className="add-body-div">
          <div id="statistics-div" className="add-div">
          <div className="stat-container">
            <div className="stat-row-div">
              <div className="row-div">
                <h1> +{data.stat.dailyuser} </h1>
                <h2> users joined today </h2>
              </div>
              <div className="row-div">
              <h1> +{data.stat.monthlyuser} </h1>
              <h2> users in this month </h2>
              </div>
            </div>
            <div className="stat-row-div">
              <div className="row-div">
                <h1> ${data.stat.dailyrevenue==null?0:data.stat.dailyrevenue} </h1>
                <h2> total revenue today </h2>
              </div>
              <div className="row-div">
              <h1> ${data.stat.monthlyrevenue==null?0:data.stat.monthlyrevenue} </h1>
              <h2> total revenue in this month </h2>
              </div>
            </div>
            </div>
          </div>
          <div id="country-div" className="add-div add-div-hidden">
              <form id="country-add-form" className="input-form left-form" onSubmit={onadd}>
                <h2> Add Country </h2>
                <span className="name-span"> Name </span>
                <input className="input-field" type="text" placeholder="Country" name="country" maxLength="30" required/>
                <br/>
                <div id="country-add-msg" className="add-msg"> </div>
                <button className="add-button" type="submit"> Add </button>
              </form>

              <form id="country-edit-form" className="input-form right-form" onSubmit={onedit}>
                <h2> Update Country </h2>
                <select id="country-select" className="select-field" name="country_id" defaultValue="" onChange={onselectchange} required>
                  <option value=""  disabled hidden>Select country</option>
                  {data.country.map(e=>{
                    return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                  })}
                </select>
                <br/>
                <div id="country-select-div" className="selected-div selected-none">
                <span className="name-span"> Name </span>
                <input id="country-select-input" className="input-field" type="text" placeholder="Country" name="country" maxLength="30" required/>
                <br/>
                <input className="input-checkbox" type="checkbox"  name="deletecountry" />
                <label className="checkbox-delete-label"> Delete </label>
                <br/>
                <div id="country-edit-msg" className="add-msg"> </div>
                <button className="add-button" type="submit"> Submit </button>
                </div>
              </form>

          </div>
          <div id="language-div" className="add-div add-div-hidden">
            <form id="language-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Language </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="Language" name="language" maxLength="30" required/>
              <br/>
              <div id="language-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="language-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Language </h2>
              <select id="language-select" className="select-field" name="language_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select language</option>
                {data.language.map(e=>{
                  return <option key={e.LANGUAGE_ID} value={e.LANGUAGE_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="language-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="language-select-input" className="input-field" type="text" placeholder="Language" name="language" maxLength="30" required/>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deletelanguage" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="language-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="genre-div" className="add-div add-div-hidden">
            <form id="genre-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Genre </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="Genre" name="genre" maxLength="30" required/>
              <br/>
              <div id="genre-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="genre-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Genre </h2>
              <select id="genre-select" className="select-field" name="genre_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select genre</option>
                {data.genre.map(e=>{
                  return <option key={e.GENRE_ID} value={e.GENRE_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="genre-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="genre-select-input" className="input-field" type="text" placeholder="Genre" name="genre" maxLength="30" required/>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deletegenre" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="genre-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="studio-div" className="add-div add-div-hidden">
            <form id="studio-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Studio </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="Studio" name="studio" maxLength="30" required/>
              <br/>
              <div id="studio-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="studio-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Studio </h2>
              <select id="studio-select" className="select-field" name="studio_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select studio</option>
                {data.studio.map(e=>{
                  return <option key={e.STUDIO_ID} value={e.STUDIO_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="studio-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="studio-select-input" className="input-field" type="text" placeholder="Studio" name="studio" maxLength="30" required/>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deletestudio" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="studio-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="tv_network-div" className="add-div add-div-hidden">
            <form id="tv_network-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add TV Network </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="TV Network" name="tv_network" maxLength="30" required/>
              <br/>
              <div id="tv_network-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="tv_network-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update TV Network </h2>
              <select id="tv_network-select" className="select-field" name="tv_network_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select tv network</option>
                {data.tvnetwork.map(e=>{
                  return <option key={e.TV_NETWORK_ID} value={e.TV_NETWORK_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="tv_network-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="tv_network-select-input" className="input-field" type="text" placeholder="TV Network" name="tv_network" maxLength="30" required/>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deletetv_network" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="tv_network-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="actor-div" className="add-div add-div-hidden">
            <form id="actor-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Actor </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="Name" name="name" maxLength="30" required/>
              <br/>
              <span className="name-span"> Date of birth </span>
              <input className="input-field" type="date" placeholder="Date of birth" name="dob" required/>
              <br/>
              <span className="name-span"> Height </span>
              <input className="input-field" type="text" placeholder="Height(cm)" name="height" maxLength="3" onKeyDown={checkVal} required/>
              <br/>
              <span className="name-span"> Image </span>
              <input className="input-field" type="text" placeholder="Profile image" name="profileimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Cover image </span>
              <input className="input-field" type="text" placeholder="Cover image" name="coverimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Country </span>
              <select className="select-field" name="country" defaultValue="" required>
                <option value=""  disabled hidden>Select country</option>

                {data.country.map(e=>{
                  return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="country-span" className="clickable" onClick={notinlist}> country </span> </div>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea className="text-field" name="description" placeholder="Description" required>
              </textarea>
              <br/>
              <div id="actor-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="actor-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Actor </h2>
              <select id="actor-select" className="select-field" name="actor_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select actor</option>
                {data.actor.map(e=>{
                  return <option key={e.ACTOR_ID} value={e.ACTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="actor-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="actor-select-name-input" className="input-field" type="text" placeholder="Name" name="name" maxLength="30" required/>
              <br/>
              <span className="name-span"> Date of birth </span>
              <input id="actor-select-dob-input" className="input-field" type="date" placeholder="Date of birth" name="dob" required/>
              <br/>
              <span className="name-span"> Height </span>
              <input id="actor-select-height-input" className="input-field" type="text" placeholder="Height(cm)" name="height" maxLength="3" onKeyDown={checkVal} required/>
              <br/>
              <span className="name-span"> Image </span>
              <input id="actor-select-image-input" className="input-field" type="text" placeholder="Profile image" name="profileimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Cover image </span>
              <input id="actor-select-coverimage-input" className="input-field" type="text" placeholder="Cover image" name="coverimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Country </span>
              <select id="actor-select-country-input" className="select-field" name="country" defaultValue="" required>
                <option value=""  disabled hidden>Select country</option>

                {data.country.map(e=>{
                  return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="country-span" className="clickable" onClick={notinlist}> country </span> </div>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea id="actor-select-description-input" className="text-field" name="description" placeholder="Description" required>
              </textarea>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deleteactor" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="actor-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="director-div" className="add-div add-div-hidden">
            <form id="director-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Director </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="Name" name="name" maxLength="30" required/>
              <br/>
              <span className="name-span"> Date of birth </span>
              <input className="input-field" type="date" placeholder="Date of birth" name="dob" required/>
              <br/>
              <span className="name-span"> Image </span>
              <input className="input-field" type="text" placeholder="Profile image" name="profileimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Cover image </span>
              <input className="input-field" type="text" placeholder="Cover image" name="coverimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Country </span>
              <select className="select-field" name="country" defaultValue="" required>
                <option value=""  disabled hidden>Select country</option>

                {data.country.map(e=>{
                  return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="country-span" className="clickable" onClick={notinlist}> country </span> </div>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea className="text-field" name="description" placeholder="Description" required>
              </textarea>
              <br/>
              <div id="director-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="director-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Director </h2>
              <select id="director-select" className="select-field" name="director_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select director</option>
                {data.director.map(e=>{
                  return <option key={e.DIRECTOR_ID} value={e.DIRECTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="director-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="director-select-name-input" className="input-field" type="text" placeholder="Name" name="name" maxLength="30" required/>
              <br/>
              <span className="name-span"> Date of birth </span>
              <input id="director-select-dob-input" className="input-field" type="date" placeholder="Date of birth" name="dob" required/>
              <br/>
              <span className="name-span"> Image </span>
              <input id="director-select-image-input" className="input-field" type="text" placeholder="Profile image" name="profileimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Cover image </span>
              <input id="director-select-coverimage-input" className="input-field" type="text" placeholder="Cover image" name="coverimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Country </span>
              <select id="director-select-country-input" className="select-field" name="country" defaultValue="" required>
                <option value=""  disabled hidden>Select country</option>

                {data.country.map(e=>{
                  return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="country-span" className="clickable" onClick={notinlist}> country </span> </div>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea id="director-select-description-input" className="text-field" name="description" placeholder="Description" required>
              </textarea>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deletedirector" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="director-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="award-div" className="add-div add-div-hidden">
            <form id="award-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Award </h2>
              <span className="name-span"> Name </span>
              <input className="input-field" type="text" placeholder="Name" name="award" maxLength="50" required/>
              <br/>
              <span className="name-span"> Issued by </span>
              <input className="input-field" type="text" placeholder="Issued by" name="issuedby" maxLength="30" required/>
              <br/>
              <div id="award-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="award-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Award </h2>
              <select id="award-select" className="select-field" name="award_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select award</option>
                {data.award.map(e=>{
                    return <option key={e.AWARD_ID} value={e.AWARD_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div id="award-select-div" className="selected-div selected-none">
              <span className="name-span"> Name </span>
              <input id="award-select-input" className="input-field" type="text" placeholder="Name" name="award" maxLength="50" required/>
              <br/>
              <span className="name-span"> Issued by </span>
              <input id="award-select-issuedby-input" className="input-field" type="text" placeholder="Issued by" name="issuedby" maxLength="30" required/>
              <br/>
              <input className="input-checkbox" type="checkbox"  name="deleteaward" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="award-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="content-div" className="add-div add-div-hidden">
            <form id="content-add-form" className="input-form left-form" onSubmit={onadd}>
              <h2> Add Content </h2>
              <span className="name-span"> Title </span>
              <input className="input-field" type="text" placeholder="Title" name="ctitle" maxLength="50" required/>
              <br/>
              <span className="name-span"> Image </span>
              <input className="input-field" type="text" placeholder="Image" name="cimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Trailer </span>
              <input className="input-field" type="text" placeholder="Trailer" name="ctrailer" maxLength="100" required/>
              <br/>
              <span className="name-span"> Language </span>
              <select className="select-field" name="language" defaultValue="" required>
                <option value=""  disabled hidden>Select language</option>
                {data.language.map(e=>{
                    return <option key={e.LANGUAGE_ID} value={e.LANGUAGE_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="language-span" className="clickable" onClick={notinlist}> language </span> </div>
              <br/>
              <span className="name-span"> Country </span>
              <select className="select-field" name="country" defaultValue="" required>
                <option value=""  disabled hidden>Select country</option>
                {data.country.map(e=>{
                    return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="country-span" className="clickable" onClick={notinlist}> country </span> </div>
              <br/>
              <span className="name-span"> Studio </span>
              <select className="select-field" name="studio" defaultValue="" required>
                <option value=""  disabled hidden>Select studio</option>
                {data.studio.map(e=>{
                    return <option key={e.STUDIO_ID} value={e.STUDIO_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="studio-span" className="clickable" onClick={notinlist}> studio </span> </div>
              <br/>
              <span className="name-span"> Director </span>
              <select className="select-field" name="director" defaultValue="" required>
                <option value=""  disabled hidden>Select director</option>
                {data.director.map(e=>{
                    return <option key={e.DIRECTOR_ID} value={e.DIRECTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="director-span" className="clickable" onClick={notinlist}> director </span> </div>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea className="text-field" name="cdescription" placeholder="Description">
              </textarea>
              <br/>
              <input className="checkbox-field" name="ctype" type="radio" value="M" onClick={changecontenttype} required/>
              <label className="checkbox-label"> Movie </label>
              <input className="checkbox-field" name="ctype" type="radio" value="T" onClick={changecontenttype} required/>
              <label className="checkbox-label"> TV Series</label>
              <div id="movie-add" className="content-type-hide">
                <span className="name-span"> Video </span>
                <input className="input-field" type="text" placeholder="Video" name="mvideo" maxLength="100" />
                <br/>
                <span className="name-span"> Duration </span>
                <input className="input-field" type="text" placeholder="Duration(seconds)" name="mduration" maxLength="5" onKeyDown={checkVal} />
                <br/>
                <span className="name-span"> Release date </span>
                <input className="input-field" type="date" placeholder="Release date" name="mreleasedate" />
                <br/>
              </div>
              <div id="tv-add" className="content-type-hide">
                <span className="name-span"> TV network </span>
                <select className="select-field" name="ttvnetwork" defaultValue="" required>
                  <option value=""  disabled hidden>Select tv network</option>
                  {data.tvnetwork.map(e=>{
                      return <option key={e.TV_NETWORK_ID} value={e.TV_NETWORK_ID}> {e.NAME} </option>
                  })}
                </select>
                <br/>
                <div className="not-in-list-div"> Not in the list? Add <span id="tv_network-span" className="clickable" onClick={notinlist}> tv network </span> </div>
                <br/>
                <span className="name-span"> Start date </span>
                <input className="input-field" type="date" placeholder="Start date" name="tstartdate" />
                <br/>
                <span className="name-span"> End date </span>
                <input className="input-field" type="date" placeholder="End date" name="tenddate" />
                <br/>
              </div>
              <div id="content-add-msg" className="add-msg">  </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <form id="content-edit-form" className="input-form right-form" onSubmit={onedit}>
              <h2> Update Content </h2>
              <select id="content-select" className="select-field" name="content_id" defaultValue="" onChange={onselectchange} required>
                <option value=""  disabled hidden>Select content</option>
                {data.content.map(e=>{
                  return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div id="content-select-div" className="selected-div selected-none">
              <span className="name-span"> Title </span>
              <input id="content-select-title-input" className="input-field" type="text" placeholder="Title" name="ctitle" maxLength="50" required/>
              <br/>
              <span className="name-span"> Image </span>
              <input id="content-select-image-input" className="input-field" type="text" placeholder="Image" name="cimage" maxLength="100" required/>
              <br/>
              <span className="name-span"> Trailer </span>
              <input id="content-select-trailer-input" className="input-field" type="text" placeholder="Trailer" name="ctrailer" maxLength="100" required/>
              <br/>
              <span className="name-span"> Language </span>
              <select id="content-select-language-input" className="select-field" name="language" defaultValue="" required>
                <option value=""  disabled hidden>Select language</option>
                {data.language.map(e=>{
                    return <option key={e.LANGUAGE_ID} value={e.LANGUAGE_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="language-span" className="clickable" onClick={notinlist}> language </span> </div>
              <br/>
              <span className="name-span"> Country </span>
              <select id="content-select-country-input" className="select-field" name="country" defaultValue="" required>
                <option value=""  disabled hidden>Select country</option>
                {data.country.map(e=>{
                    return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="country-span" className="clickable" onClick={notinlist}> country </span> </div>
              <br/>
              <span className="name-span"> Studio </span>
              <select id="content-select-studio-input" className="select-field" name="studio" defaultValue="" required>
                <option value=""  disabled hidden>Select studio</option>
                {data.studio.map(e=>{
                    return <option key={e.STUDIO_ID} value={e.STUDIO_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="studio-span" className="clickable" onClick={notinlist}> studio </span> </div>
              <br/>
              <span className="name-span"> Director </span>
              <select id="content-select-director-input" className="select-field" name="director" defaultValue="" required>
                <option value=""  disabled hidden>Select director</option>
                {data.director.map(e=>{
                    return <option key={e.DIRECTOR_ID} value={e.DIRECTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="director-span" className="clickable" onClick={notinlist}> director </span> </div>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea id="content-select-description-input" className="text-field" name="cdescription" placeholder="Description">
              </textarea>
              <br/>
              <input id="content-select-typem-input" className="checkbox-field" name="ctypeedit" type="radio" value="M" onClick={changecontenttype} required/>
              <label className="checkbox-label"> Movie </label>
              <input id="content-select-typet-input" className="checkbox-field" name="ctypeedit" type="radio" value="T" onClick={changecontenttype} required/>
              <label className="checkbox-label"> TV Series</label>
              <div id="movie-edit" className="content-type-hide">
                <span className="name-span"> Video </span>
                <input id="content-select-mvideo-input" className="input-field" type="text" placeholder="Video" name="mvideo" maxLength="100" />
                <br/>
                <span className="name-span"> Duration </span>
                <input id="content-select-mduration-input" className="input-field" type="text" placeholder="Duration(seconds)" name="mduration" maxLength="5" onKeyDown={checkVal} />
                <br/>
                <span className="name-span"> Release date </span>
                <input id="content-select-mreleasedate-input" className="input-field" type="date" placeholder="Release date" name="mreleasedate" />
                <br/>
              </div>
              <div id="tv-edit" className="content-type-hide">
                <span className="name-span"> TV network </span>
                <select id="content-select-ttvnetwork-input" className="select-field" name="ttvnetwork" defaultValue="" required>
                  <option value=""  disabled hidden>Select tv network</option>
                  {data.tvnetwork.map(e=>{
                      return <option key={e.TV_NETWORK_ID} value={e.TV_NETWORK_ID}> {e.NAME} </option>
                  })}
                </select>
                <br/>
                <div className="not-in-list-div"> Not in the list? Add <span id="tv_network-span" className="clickable" onClick={notinlist}> tv network </span> </div>
                <br/>
                <span className="name-span"> Start date </span>
                <input id="content-select-tstartdate-input" className="input-field" type="date" placeholder="Start date" name="tstartdate" />
                <br/>
                <span className="name-span"> End date </span>
                <input id="content-select-tenddate-input" className="input-field" type="date" placeholder="End date" name="tenddate" />
                <br/>
              </div>
              <input className="input-checkbox" type="checkbox"  name="deletecontent" />
              <label className="checkbox-delete-label"> Delete </label>
              <br/>
              <div id="content-edit-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Submit </button>
              </div>
            </form>
          </div>
          <div id="content-details-div" className="add-div add-div-hidden">

            <form id="episodes-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Episodes </h2>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content" defaultValue="" required>
                <option value=""  disabled hidden>Select content</option>
                {data.series.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <span className="name-span"> Season no </span>
              <input className="input-field" type="text" placeholder="Season no" name="seasonno" maxLength="2" onKeyDown={checkVal} required/>
              <br/>
              <span className="name-span"> Episode no </span>
              <input className="input-field" type="text" placeholder="Episode no" name="episodeno" maxLength="2" onKeyDown={checkVal} required/>
              <br/>
              <span className="name-span"> Title </span>
              <input className="input-field" type="text" placeholder="Title" name="title" maxLength="30" required/>
              <br/>
              <span className="name-span"> Duration </span>
              <input className="input-field" type="text" placeholder="Duration(seconds)" name="duration" maxLength="5" onKeyDown={checkVal} required/>
              <br/>
              <span className="name-span"> Release date </span>
              <input className="input-field" type="date" placeholder="Release date" name="releasedate" maxLength="30" required/>
              <br/>
              <span className="name-span"> Video </span>
              <input className="input-field" type="text" placeholder="Video" name="video" maxLength="100" required/>
              <br/>
              <span className="name-span description-span"> Description </span>
              <textarea className="text-field" name="description" placeholder="Description">
              </textarea>
              <br/>
              <div id="episodes-add-msg" className="add-msg">  </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <br/>
            <form id="acted-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Acted </h2>
              <span className="name-span"> Actor </span>
              <select className="select-field" name="actor" defaultValue="" required>
                <option value=""  disabled hidden>Select actor</option>
                {data.actor.map(e=>{
                    return <option key={e.ACTOR_ID} value={e.ACTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="actor-span" className="clickable" onClick={notinlist}> actor </span> </div>
              <br/>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content" defaultValue="" required>
                <option value=""  disabled hidden>Select content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <span className="name-span"> Character name </span>
              <input className="input-field" type="text" placeholder="Character name" name="charactername" maxLength="30" required/>
              <br/>
              <div id="acted-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <br/>
            <form id="actor-received-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Actor Received </h2>
              <span className="name-span"> Award </span>
              <select className="select-field" name="award" defaultValue="" required>
                <option value=""  disabled hidden>Select award</option>
                {data.award.map(e=>{
                    return <option key={e.AWARD_ID} value={e.AWARD_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="award-span" className="clickable" onClick={notinlist}> award </span> </div>
              <br/>
              <span className="name-span"> Actor </span>
              <select className="select-field" name="actor" defaultValue="" required>
                <option value=""  disabled hidden>Select actor</option>
                {data.actor.map(e=>{
                    return <option key={e.ACTOR_ID} value={e.ACTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="actor-span" className="clickable" onClick={notinlist}> actor </span> </div>
              <br/>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content" defaultValue="" required>
                <option value=""  disabled hidden>Select content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <span className="name-span"> Received date </span>
              <input className="input-field" type="date" placeholder="Received date" name="receiveddate" required/>
              <br/>
              <div id="actor-received-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <br/>
            <form id="director-received-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Director Received </h2>
              <span className="name-span"> Award </span>
              <select className="select-field" name="award" defaultValue="" required>
                <option value=""  disabled hidden>Select award</option>
                {data.award.map(e=>{
                    return <option key={e.AWARD_ID} value={e.AWARD_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="award-span" className="clickable" onClick={notinlist}> award </span> </div>
              <br/>
              <span className="name-span"> Director </span>
              <select className="select-field" name="director" defaultValue="" required>
                <option value=""  disabled hidden>Select director</option>
                {data.director.map(e=>{
                    return <option key={e.DIRECTOR_ID} value={e.DIRECTOR_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="director-span" className="clickable" onClick={notinlist}> director </span> </div>
              <br/>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content" defaultValue="" required>
                <option value=""  disabled hidden>Select content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <span className="name-span"> Received date </span>
              <input className="input-field" type="date" placeholder="Received date" name="receiveddate" required/>
              <br/>
              <div id="director-received-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <br/>
            <form id="content-received-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Content Received </h2>
              <span className="name-span"> Award </span>
              <select className="select-field" name="award" defaultValue="" required>
                <option value=""  disabled hidden>Select Award</option>
                {data.award.map(e=>{
                    return <option key={e.AWARD_ID} value={e.AWARD_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="award-span" className="clickable" onClick={notinlist}> award </span> </div>
              <br/>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content" defaultValue="" required>
                <option value=""  disabled hidden>Select Content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <span className="name-span"> Received date </span>
              <input className="input-field" type="date" placeholder="Received date" name="receiveddate" required/>
              <br/>
              <div id="content-received-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <br/>
            <form id="content-genre-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Content Genre </h2>
              <span className="name-span"> Genre </span>
              <select className="select-field" name="genre" defaultValue="" required>
                <option value=""  disabled hidden>Select Genre</option>
                {data.genre.map(e=>{
                    return <option key={e.GENRE_ID} value={e.GENRE_ID}> {e.NAME} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="genre-span" className="clickable" onClick={notinlist}> genre </span> </div>
              <br/>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content" defaultValue="" required>
                <option value=""  disabled hidden>Select Content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <div id="content-genre-add-msg" className="add-msg"> </div>
              <button className="add-button" type="submit"> Add </button>
            </form>
            <br/>
            <form id="similar-contents-add-form" className="input-form" onSubmit={onadd}>
              <h2> Add Similar Contents </h2>
              <span className="name-span"> Content </span>
              <select className="select-field" name="content1" defaultValue="" required>
                <option value=""  disabled hidden>Select content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <span className="name-span"> Similar content </span>
              <select className="select-field" name="content2" defaultValue="" required>
                <option value=""  disabled hidden>Select similar content</option>
                {data.content.map(e=>{
                    return <option key={e.CONTENT_ID} value={e.CONTENT_ID}> {e.TITLE} </option>
                })}
              </select>
              <br/>
              <div className="not-in-list-div"> Not in the list? Add <span id="content-span" className="clickable" onClick={notinlist}> content </span> </div>
              <br/>
              <div id="similar-contents-add-msg" className="add-msg">  </div>
              <button className="add-button" type="submit"> Add </button>
            </form>



          </div>

        </div>
      </div>




    </div>
  );
}






export default Dashboard;
