import React from 'react' ;
import "../App.css" ;
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate() ;
  return (
    <div className='landingPageContainer'>
      <nav>
        <div className='navHeader'>
          <h2>Virtual Meet</h2>
        </div>
        <div className='navList'>
          <p onClick={() => {
            router("/cjhd") ;
          }}>Join as Guest</p>
          <p onClick={() => {
            router("/auth") ;
          }}>Register</p>
          <div role='button'>
            <p onClick={() => {
            router("/auth") ;
          }}>Login</p>  
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1><span style={{color:"orange"}}>Connect</span> With Your Loved Ones</h1>
          <p>Cover a distance by <span style={{fontWeight:"500"}}>Virtual Meet</span></p>
          <div className='linkButton' role='button'>
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="" />
        </div>
      </div>

    </div>
  )
}