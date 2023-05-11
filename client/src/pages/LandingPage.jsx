import React from 'react';
import logo from '../logo.svg'
import leaves1 from '../images/leaves1.jpg'
import COLORS from '../scripts/colors'
import styled from 'styled-components'
import { Link } from 'react-router-dom';

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
      <div className="row d-lg-none" style={{height:"200px"}}>
        <div className=" d-flex position-relative justify-content-center " style={{clipPath: "polygon(0 0, 100% 0, 100% 60%, 51% 100%, 49% 100%, 0 60%)"}}>
          <img  src={leaves1} style={{ position: "absolute"}}/>

          <div className="position-absolute align-items-center mt-3" >
            <div className=" d-flex ">
              <img src={logo} alt="Smerre Logo" height="100" />
              <h1 style={{ margin: "0", color: "white", fontSize: "5rem" }}>merre</h1>
            </div>
            <div>
              <p style={{ margin: "0", color: "white", fontSize: "24px", textAlign: "center" }}>Growing smarter</p>
            </div>
          </div>

        </div>
      </div>

      <div className="row vh-100">
        <div className="col-lg-7 mt-lg-5 pt-lg-5 text-center">
          <h1 className="mt-5 mx-3" style={{fontFamily: 'Montserrat, sans-serif'}}>Growing healthy, thriving plants</h1>
          <p className="my-4 mx-sm-auto mx-4" style={{fontSize: "24px", maxWidth:"500px", textAlign: "center"}}>
            Welcome to Smerre, the smart greenhouse project designed to help you grow your plants more efficiently than ever before. Our automation technology takes the guesswork out of greenhouse management, so you can focus on what really matters: growing healthy, thriving plants.
          </p>
          <Link to="/register"><Button>Get started</Button></Link>
        </div>

        <div className="col-lg-5 p-0 position-relative d-none d-lg-block" style={{clipPath: "polygon(32% 0, 100% 0, 100% 100%, 32% 100%, 3% 34%, 3% 32%)"}}>
        <div className="d-flex  justify-content-end">
          <img  src={leaves1} style={{ position: "relative"}}/>
        </div>

          <div className="d-flex  justify-content-center">
            <div className="position-absolute align-items-center ms-3" style={{top: "26%"}}>
              <div className=" d-flex ">
                <img src={logo} alt="Smerre Logo" height="100" />
                <h1 style={{ margin: "0", color: "white", fontSize: "5rem" }}>merre</h1>
              </div>
              <div>
                <p style={{ margin: "0", color: "white", fontSize: "24px", textAlign: "center" }}>Growing smarter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

  </>
  );
}

export default LandingPage;
