import React from 'react';
import "./Dropdown.css";
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

function Dropdown(props) {

  function clicked(e) {
    console.log("wow");
  }

  return (
    <div className="dropdown">
      <ul>
        <li>
          <h3 onClick={clicked}> zulakr naim </h3>
          <ul>
            <li> <h6> Change profile </h6> </li>
            <li> <h6> Change profile </h6> </li>
            <li> <h6> Change profile </h6> </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default Dropdown;
