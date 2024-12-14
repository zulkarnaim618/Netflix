import React from 'react';
import "./ContentDetails.css";
import "./Banner.css";
import "./"
import ReactDom from 'react-dom';
import netflix_logo from "./image/homeScreen_logo.png";
import {adminaut,aut} from "./App.js";
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

function AdminLogin(props) {

  const navigate = useNavigate();

  function submitLogin(e) {
    e.preventDefault();
    adminaut.admin_id = e.target.admin_id.value;
    adminaut.password = e.target.password.value;
    const msg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'
        },
      body: JSON.stringify({
          "admin_id": e.target.admin_id.value,
          "password": e.target.password.value,
      })
    };
    fetch("http://localhost:3080/adminverify",msg)
      .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status) {
            navigate("/dashboard");

          }
          else {
            document.getElementById("login-error").innerHTML = "Wrong Admin ID or Password. Please try again.";
            setTimeout(function() {
              if (document.getElementById("login-error")!=null) {
                document.getElementById("login-error").innerHTML = "";
              }
            },4000);
          }
        });

  }
  React.useEffect(() => {
    window.scrollTo(0, 0);
    aut.sessionId = Cookies.get("netflix");
    if (aut.sessionId!=null) {
      const msg = {
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
                aut.status = true;
                aut.subStatus = true;
                navigate("/profile");
              }
              else {
                console.log(aut);
                aut.status = true;
                aut.subStatus = false;
                navigate("/subscribe");
              }
            }
            else {
              Cookies.remove("netflix");
              aut.sessionId=0;

              aut.status = false;
              aut.subStatus = false;
            }
          });

    }
    else {
      aut.sessionId = 0;
      aut.status = false;
      aut.subStatus = false;
    }
  }, []);

  return (
    <div className="login-screen">
      <div className="homeScreen-top-container">
        <img
          className="netflix-logo"
          src={netflix_logo}
          alt="netflix-logo"
        />
        <div className="homeScreen-gradient"/>

        <div className="login-form-div">
          <form onSubmit={submitLogin}>
            <h1> Admin Log In </h1>
            <span id="login-error">  </span>
            <input type="text" name="admin_id" placeholder="Admin ID" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Log In</button>
            <h4> Not a admin? Navigate to <Link to="/" style={{ textDecoration: 'none' }}><span className="login-signup-link">Home</span></Link>. </h4>
          </form>
        </div>

      </div>


      <div className="home-footer">
          <div className="home-footer-content">
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

export default AdminLogin;
