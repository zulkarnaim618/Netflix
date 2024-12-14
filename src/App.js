import React from 'react';
import "./Home.css";
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
import './App.css';
import Profile from './Profile.js';
import Account from './Account.js';
import AdminLogin from "./AdminLogin.js";
import BrowseHome from './BrowseHome.js';
import BrowseTV from './BrowseTV.js';
import Dashboard from './Dashboard.js';
import BrowseMovie from './BrowseMovie.js';
import BrowseMyList from './BrowseMyList.js';
import './Dropdown.css';
import Authentication from "./Authentication.js";
import AdminAuthentication from "./AdminAuthentication.js";
import netflix_logo from "./image/homeScreen_logo.png";
import container_1_img from "./image/container-1.png";
import container_2_img from "./image/container-2.jpg";
import container_3_img from "./image/container-3.png";

let aut = new Authentication();
let adminaut = new AdminAuthentication();

function App() {

  return (
    <div className="App">
    <Router>
      <Routes>


          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Login />} exact />
          <Route path="/signup" element={<Signup />} exact />
          <Route path="/admin" element={<AdminLogin />} exact />
          <Route path="/dashboard" element={<Dashboard />} exact />
          <Route path="/account" element={<Account />} exact />
          <Route path="/subscribe" element={<Subscribe />} exact />
          <Route path="/profile" element={<Profile />} exact />
          <Route path="/browse/home" element={<BrowseHome />} exact />
          <Route path="/browse/tv" element={<BrowseTV />} exact />
          <Route path="/browse/movie" element={<BrowseMovie />} exact />
          <Route path="/browse/mylist" element={<BrowseMyList />} exact />

      </Routes>
    </Router>
    </div>
  );
}


function Home () {
  const navigate = useNavigate();
  console.log("home");
  React.useEffect(() => {
    window.scrollTo(0, 0);
    //navigate("/hello");
    authenticate(navigate);
  }, []);

  return (
    <div className="homeScreen">
      <div className="homeScreen-top-container">
        <img
          className="netflix-logo"
          src={netflix_logo}
          alt="netflix-logo"
        />
        <Link to="/login">
          <button className="login-button">
            Log In
          </button>
        </Link>
        <div className="homeScreen-gradient"/>
      </div>
      <div className="homeScreen-body">
        <h1> Unlimited movies, TV <br/> shows, and more.</h1>
        <h2> Watch anywhere. Cancel anytime.</h2>
        <h3> Ready to watch? Create an account and choose your subscription plan. </h3>
        <Link to="/signup">
          <button className="homeScreen-getstarted-button">
            Get Started >
          </button>
        </Link>
      </div>
      <div className="container">
        <div className="container-text">
          <h1> Enjoy on your TV. </h1>
          <h2> Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</h2>
        </div>
        <div className="container-img-div">
        <img
          className="container-img"
          src={container_1_img}
          alt="tv"
        />
        </div>
      </div>
      <div className="container">
        <div className="container-img-div">
        <img
          className="container-img"
          src={container_2_img}
          alt="tv"
        />
        </div>
        <div className="container-text">
          <h1> Watch everywhere. </h1>
          <h2> Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV. </h2>
        </div>
      </div>
      <div className="container">
        <div className="container-text">
          <h1> Create profile for kids. </h1>
          <h2> Send kids on adventures with their favorite characters in a space made just for them - free with your membership. </h2>
        </div>
        <div className="container-img-div">
        <img
          className="container-img"
          src={container_3_img}
          alt="tv"
        />
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


const Login= (props) => {

  const navigate = useNavigate();
  console.log("login");

  function submitLogin(e) {
    e.preventDefault();

    const msg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'Authorization': aut.sessionId
        },
      body: JSON.stringify({
          "email": e.target.email.value,
          "password": e.target.password.value,
      })
    };
    fetch("http://localhost:3080/verify",msg)
      .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status) {
            console.log("login successful");
            aut.sessionId=data.session_id;
            Cookies.set("netflix",aut.sessionId);
            aut.status = true;
            if (data.subscriptionStatus) {
              aut.subStatus = true;
              navigate("/profile");
            }
            else {
              aut.subStatus = false;
              navigate("/subscribe");
            }

          }
          else {
            console.log("login failed");
            aut.subStatus = false;
            aut.status = false;
            document.getElementById("login-error").innerHTML = "Wrong Email or Password. Please try again.";
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
    authenticate(navigate);
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
            <h1> Log In </h1>
            <span id="login-error">  </span>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Log In</button>
            <h4> New to Netflix? <Link to="/signup" style={{ textDecoration: 'none' }}><span className="login-signup-link">Sign up now</span></Link>. </h4>
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

function Signup(props) {
  const navigate = useNavigate();
  function submitSignup(e) {
    e.preventDefault();

    const msg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'Authorization': aut.sessionId
        },
      body: JSON.stringify({
          "name": e.target.name.value,
          "email": e.target.email.value,
          "password": e.target.password.value,
          "date_of_birth": e.target.date_of_birth.value,
          "country": e.target.country.value,
          "gender": e.target.gender.value
      })
    };
    fetch("http://localhost:3080/register",msg)
      .then(res => res.json())
        .then(data => {
          if (data.status) {
            console.log(data);
            aut.sessionId = data.session_id;
            Cookies.set("netflix",aut.sessionId);
            aut.subStatus = false;
            aut.status = true;
            navigate("/subscribe");
          }
          else {
            document.getElementById("signup-email-error").innerHTML = "Email already registered";
            setTimeout(function() {
              if (document.getElementById("signup-email-error")!=null) {
                document.getElementById("signup-email-error").innerHTML = "";
              }
            },4000);
          }
        });

  }

  const [country,setCountry] = React.useState([]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    authenticate(navigate);
    const msg = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'
        }
    };
    fetch("http://localhost:3080/getcountry",msg)
      .then(res => res.json())
        .then(data => {
          console.log(data.country);
          setCountry(data.country);
        });

  }, []);

  return (
    <div className="signup-screen">
      <div className="signup-top-container">
        <img
          className="netflix-logo"
          src={netflix_logo}
          alt="netflix-logo"
        />
      </div>
      <div className="signup-body-container">
        <div className="signup-form-div">
          <form onSubmit={submitSignup}>
            <h1> Create your Netflix Account </h1>
            <input className="signup-input-field" type="text" name="name" placeholder="Name" maxLength="30" required/> <br/>
            <input className="signup-input-field" type="email" name="email" placeholder="Email address" maxLength="30" required/>
            <span id="signup-email-error"> </span>
            <br/>
            <input className="signup-input-field" type="password" name="password" placeholder="Password" maxLength="30" required/> <br/>
            <label className="signup-label">Date of birth</label><br/>
            <input className="signup-input-field" type="date" name="date_of_birth" placeholder="Date of Birth" required/> <br/>
            <label className="signup-label">Country</label><br/>
            <select name="country" defaultValue="" required>
              <option value=""  disabled hidden>Select country</option>
              {country.map(e=>{
                return <option key={e.COUNTRY_ID} value={e.COUNTRY_ID}> {e.NAME} </option>
              })}
            </select>
            <br/>
            <label className="signup-label">Gender</label><br/>
            <div className="signup-gender-div">
              <input className="signup-radio" type="radio" name="gender" value="M" required/>
              <label className="signup-gender-radio-label">Male</label>
              <input className="signup-radio" type="radio" name="gender" value="F" required/>
              <label className="signup-gender-radio-label">Female</label>
            </div><br/>
            <Link to="/login" style={{ textDecoration: 'none' }}><span className="signup-login-link">Log in instead</span></Link>
            <button className="signup-create-button" type="submit"> Create </button>
          </form>
        </div>
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



const Subscribe = (props) => {
  console.log("subscribe");
  const [accountName,setAccountName] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    aut.sessionId = Cookies.get("netflix");
    console.log("authenticating");
    //session_id=13;
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
              setAccountName(data.accountname);
              if (data.subscriptionStatus) {
                //setSubStatus(true);
                aut.status = true;
                aut.subStatus = true;
                console.log(aut);
                navigate("/profile");
              }
              else {
                //setSubStatus(false);
                console.log(aut);
                aut.status = true;
                aut.subStatus = false;
              }
              //setAuth(true);


            }
            else {
              Cookies.remove("netflix");
              aut.sessionId=0;
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

  function onLogout() {
    submitLogoutRequest(navigate);
  }


  function submitSubscriptionPlan(e) {
    e.preventDefault();

    const msg = {
      method: 'POST',
      headers: {'Content-Type': 'application/json',
                'Authorization': aut.sessionId
        },
      body: JSON.stringify({
          "creditcardnumber": e.target.creditcardnumber.value,
          "subscriptionplan": e.target.subscriptionplan.value,
      })
    };
    fetch("http://localhost:3080/purchase",msg)
      .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status) {
            aut.status = true;
            if (data.subscriptionStatus) {
              aut.subStatus = true;
              navigate("/profile");
            }
          }
          else {
            Cookies.remove("netflix");
            aut.sessionId=0;
            aut.subStatus =false;
            aut.status = false;
            navigate("/login");
          }
        });

  }

  return (
    <div className="subscribe-screen">

      <div className="subscribe-body-container">
        <div className="signup-form-div">
          <form onSubmit={submitSubscriptionPlan}>
            <h1> Choose your subscription plan </h1>
            <input className="subscribe-input-field" type="text" name="creditcardnumber" placeholder="Credit card number" maxLength="16" required/> <br/>
            <label className="signup-label">Subscription plan</label><br/>
            <div className="subscribe-radio-div">
              <input className="subscribe-radio" type="radio" name="subscriptionplan" value="Basic" required/><br/>
              <label className="subscribe-radio-label">Basic</label><br/>
              <label className="subscribe-radio-label">Price: $4.99</label><br/>
              <label className="subscribe-radio-label">Quality: 720p</label><br/>
              <label className="subscribe-radio-label">Only one device</label><br/>
            </div>
            <div className="subscribe-radio-div">
              <input className="subscribe-radio" type="radio" name="subscriptionplan" value="Standard" required/><br/>
              <label className="subscribe-radio-label">Standard</label><br/>
              <label className="subscribe-radio-label">Price: $8.99</label><br/>
              <label className="subscribe-radio-label">Quality: 1080p</label><br/>
              <label className="subscribe-radio-label">Upto 2 devices</label><br/>
            </div>
            <div className="subscribe-radio-div">
              <input className="subscribe-radio" type="radio" name="subscriptionplan" value="Premium" required/><br/>
              <label className="subscribe-radio-label">Premium</label><br/>
              <label className="subscribe-radio-label">Price: $12.99</label><br/>
              <label className="subscribe-radio-label">Quality: 4k</label><br/>
              <label className="subscribe-radio-label">Upto 4 devices</label><br/>
            </div>
            <br/>
            <button className="subscribe-choose-button" type="submit"> Choose </button>
          </form>
        </div>
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

      <div className="account-top-div">
        <img
          className="account-top-netflix-logo"
          src={netflix_logo}
          alt="netflix-logo"
        />



      </div>

      <div className="dropdown">
        <ul>
          <li>
            <h3> {accountName} </h3>
            <ul>
              <li> <h6 onClick={()=>{navigate("/account")}}> Account </h6> </li>
              <li> <h6 onClick={onLogout}> Log out </h6> </li>
            </ul>
          </li>
        </ul>
      </div>

    </div>
  );
}


function authenticate(navigate) {
  //navigate("/hello");
  aut.sessionId = Cookies.get("netflix");
  console.log("authenticating");
  //session_id=13;
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
              //setSubStatus(true);
              aut.status = true;
              aut.subStatus = true;
              console.log(aut);
              navigate("/profile");
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
            aut.sessionId=0;
            //setSubStatus(false);
            //setAuth(false);
            aut.status = false;
            aut.subStatus = false;
            console.log(aut);
          }
        });

  }
  else {
    aut.sessionId = 0;
    aut.status = false;
    aut.subStatus = false;
  }
}

function submitLogoutRequest(navigate) {
  const msg = {
    method: 'GET',
    headers: {'Content-Type': 'application/json',
              'Authorization': aut.sessionId
      }
  };
  fetch("http://localhost:3080/logout",msg)
    .then(res => res.json())
      .then(data => {
          Cookies.remove("netflix");
          aut.sessionId=0;
          aut.profileId=0;
          aut.subStatus=false;
          aut.status = false;
          navigate("/login");
      });
}


export default App;

export {aut,submitLogoutRequest,adminaut};
