import React, { useState, useEffect } from 'react';
import logo from '../logo.svg'
import leaves1 from '../style/leaves1.jpg'
import leaves2 from '../style/leaves_cut.png'

import COLORS from '../scripts/colors'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

import { Link } from 'react-router-dom';
import { withAuth } from '../pages/Authentication';

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  width: 150px;
  height: 40px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1;
  font-family: -apple-system,BlinkMacSystemFont,Segoe UI,roboto,Helvetica Neue,helvetica,arial,sans-serif;
  color: #fff;
  box-shadow: 0px 10px 20px -10px  ${COLORS.defaultColor};
  transition: transform 0.2s ease-in-out;

  &:hover {
      color: #fff;
      animation: bop 0.5s ease-out;
  }

  &:active {
      color: #fff !important;
  }
  
  @keyframes bop {
      0% {
          transform: translateY(0px);
      }
      25% {
          transform: translateY(-8px);
      }
      50% {
          transform: translateY(0px);
      }
      75% {
          transform: translateY(-4px);
      }
      100% {
          transform: translateY(0px);
      }
  }
`

function LandingPage() {

  return (
    <>
      <div style={{display: "flex", height: "100%", overflow: "hidden"}}>
        <div style={{width: "60%", marginTop: "150px"}}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"  }}>
            <h1 style={{fontFamily: 'Montserrat, sans-serif'}}>Growing healthy, thriving plants</h1>
            <p style={{fontSize: "24px", width:"500px", margin: "30px auto", textAlign: "center"}}>
              Welcome to Smerre, the smart greenhouse project designed to help you grow your plants more efficiently than ever before. Our automation technology takes the guesswork out of greenhouse management, so you can focus on what really matters: growing healthy, thriving plants.
            </p>
            <Link to="/register"><Button>Get started</Button></Link>
          </div>
        </div>

        <img src={leaves2} style={{width: "40%", maxHeight: "100vh", position: "relative"}}/>
        <div style={{ position: "absolute", top: "50%", left: "82%", transform: "translate(-50%, -50%)"}}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
            <img src={logo} alt="Smerre Logo" height="100" />
            <h1 style={{ margin: "0", color: "white", fontSize: "75px" }}>merre</h1>
          </div>
          <p style={{ margin: "0", color: "white", fontSize: "24px", textAlign: "center" }}>Growing smarter</p>
        </div>
      </div> 
    </>
  );
}

export default LandingPage;
