import React from 'react';
import {  NavLink } from 'react-router-dom';
import { Input } from 'semantic-ui-react';

export default function NavMenu() {
  return ( 
  <>
   <nav className="navbar navbar-inverse">
  <div className="container-fluid">
    <div className="navbar-header">
        <NavLink className='navbar-brand' to = '/'>Glycemic</NavLink>
    </div>
    <ul className="nav navbar-nav">
      <li><NavLink className='navbar-brand' to = '/home'>Home</NavLink></li>
      <li><a href="#">Page 1</a></li>
      <li><a href="#">Page 2</a></li>
    </ul>
    <ul className="nav navbar-nav navbar-right">
      <li><a href="#"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
      <li><a href="#"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
    </ul>  
  </div>
</nav> 
  
  
  </>
  )}
