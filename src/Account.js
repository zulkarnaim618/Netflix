import React from 'react';
import "./Profile.css";
import "./Home.css";
import "./Account.css";
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


function Account(props) {

  const navigate = useNavigate();

  console.log("account");
  const [accountData,setAccountData] = React.useState({"details":{
    "NAME":"",
    "EMAIL":"",
    "DATE_OF_BIRTH":"",
    "GENDER": "",
    "JOINING_DATE": "",
    "COUNTRY_ID":0
    },
    "subscription_plan": "",
    "expire_date": "",
    "profile":[],
    "country":[]
  });

  const onLogout = () => {
    submitLogoutRequest(navigate);
  }

  React.useEffect(() => {
    aut.sessionId = Cookies.get("netflix");
    console.log("authenticating");
    //session_id=13;
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
                console.log(aut);
              }
              else {
                //setSubStatus(false);
                console.log(aut);
                aut.status = true;
                aut.subStatus = false;

              }
              msg = {
                method: 'GET',
                headers: {'Content-Type': 'application/json',
                          'Authorization': aut.sessionId
                  }
              };
              fetch("http://localhost:3080/getaccountinfo",msg)
                .then(res => res.json())
                  .then(data => {
                    console.log(data);
                    if (data.status) {
                      setAccountData(data.all);
                      if (data.all.details.GENDER==="M") {
                        document.getElementById("gender-1").checked = true;

                      }
                      else {
                        document.getElementById("gender-2").checked = true;
                      }
                    }
                    else {
                      Cookies.remove("netflix");
                      aut.sessionId = 0;
                      aut.status = false;
                      aut.subStatus = false;
                      navigate("/login");
                    }
                  });

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


  function onedit(e) {
    document.getElementById("edit-button").classList.add("button-hide");
    document.getElementById("submit-button").classList.remove("button-hide");
    document.getElementById("cancel-button").classList.remove("button-hide");

    document.getElementById("name").style.border = "1px solid #cccccc";
    document.getElementById("name").readOnly = false;
    document.getElementById("email").style.border = "1px solid #cccccc";
    document.getElementById("email").readOnly = false;
    document.getElementById("password").style.border = "1px solid #cccccc";
    document.getElementById("password").value = "";
    document.getElementById("password").readOnly = false;
    document.getElementById("date_of_birth").style.border = "1px solid #cccccc";
    document.getElementById("date_of_birth").readOnly = false;
    document.getElementById("gender-1").disabled = false;
    document.getElementById("gender-2").disabled = false;
    document.getElementById("country").style.border = "1px solid #cccccc";
    document.getElementById("country").disabled = false;
    if (aut.profileId>0) {
      document.getElementById(aut.profileId+"-profile-name").style.border = "1px solid #cccccc";
      document.getElementById(aut.profileId+"-profile-name").readOnly = false;
      document.getElementById(aut.profileId+"-delete").style.visibility = "visible";
      document.getElementById(aut.profileId+"-delete-label").style.visibility = "visible";
      document.getElementById(aut.profileId+"-pin1").style.visibility = "visible";
      document.getElementById(aut.profileId+"-pin2").style.visibility = "visible";
      document.getElementById(aut.profileId+"-pin3").style.visibility = "visible";
      document.getElementById(aut.profileId+"-pin4").style.visibility = "visible";
    }
  }

  function onsubmit(e) {
    e.preventDefault();
    let query = "";
    query += "name = '"+e.target.name.value+"', email = '"+e.target.email.value+"', date_of_birth = TO_DATE('"+e.target.date_of_birth.value+"','YYYY-MM-DD'), country_id = "+e.target.country_id.value+", gender = '"+e.target.gender.value+"'";
    if (e.target.password.value.length>0) {
      query += ", password = '" + e.target.password.value+"'";
    }

    let profile_query = "";
    let delete_profile = "";
    if (aut.profileId>0) {
      profile_query += "name = '"+e.target[aut.profileId+"-profile-name"].value+"'";
      if (e.target[aut.profileId+"-pin1"].value.length>0 && e.target[aut.profileId+"-pin2"].value.length>0 && e.target[aut.profileId+"-pin3"].value.length>0 && e.target[aut.profileId+"-pin4"].value.length>0) {
        profile_query += ", pin = "+e.target[aut.profileId+"-pin1"].value+e.target[aut.profileId+"-pin2"].value+e.target[aut.profileId+"-pin3"].value+e.target[aut.profileId+"-pin4"].value;
      }
      profile_query += " where profile_id = "+aut.profileId;
      if (e.target[aut.profileId+"-delete"].checked) {
        delete_profile = "where profile_id = "+aut.profileId;
      }

    }

    const msg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'Authorization': aut.sessionId
        },
      body: JSON.stringify({

          "account_query": query,
          "profile_query": profile_query,
          "delete_profile": delete_profile
      })
    };
    console.log(msg.body);
    fetch("http://localhost:3080/submitaccountchange",msg)
      .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status) {
            if (data.changeStatus) {
              if (delete_profile.length>0) aut.profileId=0;
              setAccountData(data.all);
              document.getElementById("country").value = data.all.details.COUNTRY_ID;
              document.getElementById("edit-button").classList.remove("button-hide");
              document.getElementById("submit-button").classList.add("button-hide");
              document.getElementById("cancel-button").classList.add("button-hide");

              document.getElementById("name").style.border = "1px solid white";
              document.getElementById("name").readOnly = true;
              document.getElementById("email").style.border = "1px solid white";
              document.getElementById("email").readOnly = true;
              document.getElementById("password").style.border = "1px solid white";
              document.getElementById("password").value = "******";
              document.getElementById("password").readOnly = true;
              document.getElementById("date_of_birth").style.border = "1px solid white";
              document.getElementById("date_of_birth").readOnly = true;
              document.getElementById("gender-1").disabled = true;
              document.getElementById("gender-2").disabled = true;
              document.getElementById("country").style.border = "1px solid white";
              document.getElementById("country").disabled = true;

              if (aut.profileId>0) {
                document.getElementById(aut.profileId+"-profile-name").style.border = "1px solid white";
                document.getElementById(aut.profileId+"-profile-name").readOnly = true;
                document.getElementById(aut.profileId+"-delete").style.visibility = "hidden";
                document.getElementById(aut.profileId+"-delete-label").style.visibility = "hidden";
                document.getElementById(aut.profileId+"-pin1").style.visibility = "hidden";
                document.getElementById(aut.profileId+"-pin2").style.visibility = "hidden";
                document.getElementById(aut.profileId+"-pin3").style.visibility = "hidden";
                document.getElementById(aut.profileId+"-pin4").style.visibility = "hidden";
                document.getElementById(aut.profileId+"-pin1").value = "";
                document.getElementById(aut.profileId+"-pin2").value = "";
                document.getElementById(aut.profileId+"-pin3").value = "";
                document.getElementById(aut.profileId+"-pin4").value = "";

              }
            }
            else {
              document.getElementById("email-error").style.visibility = "visible";
              setTimeout(function() {
                if (document.getElementById("email-error")!=null) {
                  document.getElementById("email-error").style.visibility = "hidden";
                }
              },4000);
            }
          }
          else {
            aut.sessionId = 0;
            Cookies.remove("netflix");
            aut.status = false;
            navigate("/login");
          }
        });
  }

  function oncancel(e) {
    e.stopPropagation();
    document.getElementById("edit-button").classList.remove("button-hide");
    document.getElementById("submit-button").classList.add("button-hide");
    document.getElementById("cancel-button").classList.add("button-hide");

    document.getElementById("name").style.border = "1px solid white";
    document.getElementById("name").readOnly = true;
    document.getElementById("email").style.border = "1px solid white";
    document.getElementById("email").readOnly = true;
    document.getElementById("password").style.border = "1px solid white";
    document.getElementById("password").value = "******";
    document.getElementById("password").readOnly = true;
    document.getElementById("date_of_birth").style.border = "1px solid white";
    document.getElementById("date_of_birth").readOnly = true;
    document.getElementById("gender-1").disabled = true;
    document.getElementById("gender-2").disabled = true;
    document.getElementById("country").style.border = "1px solid white";
    document.getElementById("country").disabled = true;

    document.getElementById("name").value = accountData.details.NAME;
    document.getElementById("email").value = accountData.details.EMAIL;
    document.getElementById("date_of_birth").value = accountData.details.DATE_OF_BIRTH;
    if (accountData.details.GENDER==="M") {
      document.getElementById("gender-1").checked = true;
    }
    else {
      document.getElementById("gender-2").checked = true;
    }
    document.getElementById("country").value = accountData.details.COUNTRY_ID;
    if (aut.profileId>0) {
      document.getElementById(aut.profileId+"-profile-name").style.border = "1px solid white";
      document.getElementById(aut.profileId+"-profile-name").readOnly = true;
      document.getElementById(aut.profileId+"-delete").style.visibility = "hidden";
      document.getElementById(aut.profileId+"-delete-label").style.visibility = "hidden";
      document.getElementById(aut.profileId+"-pin1").style.visibility = "hidden";
      document.getElementById(aut.profileId+"-pin2").style.visibility = "hidden";
      document.getElementById(aut.profileId+"-pin3").style.visibility = "hidden";
      document.getElementById(aut.profileId+"-pin4").style.visibility = "hidden";

      document.getElementById(aut.profileId+"-profile-name").value = document.getElementById(aut.profileId+"-profile-name").defaultValue;
      document.getElementById(aut.profileId+"-delete").checked = false;
      document.getElementById(aut.profileId+"-pin1").value = "";
      document.getElementById(aut.profileId+"-pin2").value = "";
      document.getElementById(aut.profileId+"-pin3").value = "";
      document.getElementById(aut.profileId+"-pin4").value = "";
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
                <h3> {accountData.details.NAME} </h3>
                <ul>
                  {aut.profileId==0?<></>:<li> <h6 onClick={()=> {aut.profileId=0;navigate("/profile");}}> Change profile </h6> </li>}
                  <li> <h6 onClick={onLogout}> Log out </h6> </li>
                </ul>
              </li>
            </ul>
          </div>

      </div>

      <div className="account-body-div">
        <form onSubmit={onsubmit}>

        <div className="account-middle-div-container">
          <table className="account-info-table">
            <tbody>
            <tr>
              <td className="cell"> <h3> Account </h3>  </td>
              <td className="cell"> Member since {accountData.details.JOINING_DATE}</td>
            </tr>
            </tbody>
          </table>
            <hr/>
          <table className="account-info-table">
            <tbody>
            <tr>
              <td className="cell title-cell" rowSpan="6"> PERSONAL INFORMATION </td>
              <td className="cell info-cell"> Name:
              <input id="name" className="input-edit" type="text" name="name" defaultValue={accountData.details.NAME} readOnly required/>
              </td>


            </tr>
            <tr>
              <td className="cell info-cell"> Email:
              <input id="email" className="input-edit" type="email" name="email" defaultValue={accountData.details.EMAIL} readOnly required/>
              <label id="email-error"> Email already registered </label>
              </td>

            </tr>
            <tr>
            <td className="cell info-cell"> Password:
            <input id="password" className="input-edit" type="password" name="password" defaultValue="******" readOnly/>
            </td>
            </tr>
            <tr>
              <td className="cell info-cell"> Date of birth:
              <input id="date_of_birth" className="input-edit" type="date" name="date_of_birth" defaultValue={accountData.details.DATE_OF_BIRTH} readOnly required/>
              </td>
            </tr>
            <tr>
              <td className="cell info-cell"> Gender:

                <input id="gender-1" className="input-edit" type="radio" name="gender" value="M" disabled required/>
                <label>Male</label>
                <input id="gender-2" className="input-edit" type="radio" name="gender" value="F" disabled required/>
                <label>Female</label>

              </td>
            </tr>
            <tr>
              <td className="cell info-cell"> Country:
              {accountData.details.COUNTRY_ID>0?
              <select id="country" className="input-edit input-select" name="country_id" defaultValue={accountData.details.COUNTRY_ID} required disabled>
                {accountData.country.map(e=>{
                  return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
                })}
              </select>
              :null
              }
              </td>
            </tr>
            </tbody>
          </table>
            <hr/>
          <table className="account-info-table">
            <tbody>
            <tr>
              <td className="cell title-cell" rowSpan="2"> PLAN DETAILS </td>
              <td className="cell info-cell"> Plan:
              <input className="input-edit" type="text" name="plan" defaultValue={accountData.subscription_plan} readOnly/>
              </td>
            </tr>
            <tr>
              <td className="cell info-cell"> Expire date:
              <input className="input-edit" type="date" name="expire_date" defaultValue={accountData.expire_date} readOnly/>
              </td>
            </tr>
            </tbody>
          </table>
            <hr/>
          <table className="account-info-table">
            <tbody>
            <tr>
              <td className="cell title-cell"> PROFILES </td>

              <td className="cell profile-cell">
                {accountData.profile.map(e =>

                  <AccountProfileCard key={e.PROFILE_ID} profile_id={e.PROFILE_ID} name={e.NAME} accountData={accountData} setAccountData={setAccountData} />

                )}
              </td>
            </tr>
            </tbody>
          </table>

          <button id="submit-button" className="side-button side-submit button-hide" type="submit"> Submit </button>

        </div>

        </form>
        <button id="cancel-button" className="side-button side-cancel button-hide" onClick={oncancel}> Cancel </button>
        <button id="edit-button" className="side-button side-edit" onClick={onedit}> Edit Information </button>
      </div>

      <div className="signup-footer">
        <div className="signup-footer-content">
        <div className="footer-content-div">
           <p> Questions? Contact Us </p>
           <p> FAQ </p>
           <p> Privacy </p>
         </div>
         <div className="footer-content-div">
            <p> Help Center </p>
            <p> Jobs </p>
            <p> Legal Notices </p>
          </div>
          <div className="footer-content-div">
             <p> Corporate Information </p>
             <p> Terms of Use </p>
             <p> Media Center </p>
           </div>
           <div className="footer-content-div">
              <p> Investor Relations </p>
              <p> Ways to Watch </p>
              <p> Only on Netflix </p>
            </div>
          <p> Netflix Bangladesh </p>
        </div>
      </div>


    </div>
  );
}

function AccountProfileCard(props) {
  const navigate = useNavigate();


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
    <>
    <table>
      <tbody>
        <tr>
          <td className="cell info-cell-left" rowSpan="3">
            <div className="account-profile-card">

                <img
                  name="avatar"
                  className="account-profile-avatar"
                  src={profile_avatar}
                  alt="profile-avatar"
                />
                <div className="account-profile-card-name">
                <input id={props.profile_id+"-delete"} className="input-edit checkbox" type="checkbox" name={props.profile_id+"-delete"} /> <label id={props.profile_id+"-delete-label"} className="delete-label"> Delete </label> <br/>
                <input id={props.profile_id+"-profile-name"} className="input-edit profile-input" type="text" name={props.profile_id+"-profile-name"} defaultValue={props.name} readOnly required/> <br/>
                <input type="text" name={props.profile_id+"-pin1"} id={props.profile_id+"-pin1"} style={{visibility:"hidden",width:"28px",height:"28px",margin:"0 10px 0 20px",textAlign:"center",padding:"0"}} onKeyDown={checkVal}/>
                <input type="text" name={props.profile_id+"-pin2"} id={props.profile_id+"-pin2"} style={{visibility:"hidden",width:"28px",height:"28px",margin:"0 10px",textAlign:"center",padding:"0"}} onKeyDown={checkVal}/>
                <input type="text" name={props.profile_id+"-pin3"} id={props.profile_id+"-pin3"} style={{visibility:"hidden",width:"28px",height:"28px",margin:"0 10px",textAlign:"center",padding:"0"}} onKeyDown={checkVal}/>
                <input type="text" name={props.profile_id+"-pin4"} id={props.profile_id+"-pin4"} style={{visibility:"hidden",width:"28px",height:"28px",margin:"0 20px 0 10px",textAlign:"center",padding:"0"}} onKeyDown={checkVal}/>
                </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <hr/>
    </>
  );
}



export default Account;
