import React, { useLayoutEffect, useState } from 'react'
import api from '../api'
import ValidationError from './ValidationError'
import { InputGroup } from 'react-bootstrap';
import { useNavigate} from 'react-router-dom';

import logo from '../images/smerre_logo.png'
import leaves1 from '../images/leaves1.jpg'
import leaves2 from '../images/leaves2.jpg'
import COLORS from '../scripts/colors'

import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`

`

const InputIcon = styled(InputGroup.Text)`
    background-color: #ffff;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    width: 100px;
    height: 40px;
    margin: 15px 15px 15px 0px;
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

function Register () {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [errorKey, setErrorKey] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function handleRegister(e) {
        e.preventDefault()

        const form = e.target
        const user = {
            username: form[0].value,
            firstName: form[1].value,
            lastName: form[2].value,
            location: form[3].value,
            email: form[4].value,
            password: form[5].value,
            confirmPassword: form[6].value
        }

        try {
            const res = await api.registerUser(user);
            const data = await res.data;
            
            // If something went wrong
            if(data.message != "Success"){
                setErrorMessage(data.message);
                setErrorKey((prevKey) => prevKey + 1);
                return;
            }

            // Redirect to the login page
            navigate("/login");
        } catch(err) {
            console.log(err);
            setErrorMessage(err)
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-start">
        <div className="p-5 rounded shadow-lg bg-white my-5 d-flex flex-column col-10 col-sm-8 col-md-7 col-lg-6 col-xl-4 overflow-hidden" style={{  maxHeight: '800px'}}>
          <div className="flex-grow-1" style={{ margin: "-100px 50px 0px -100px", width: "700px", height: "400px",  overflow: "hidden", transform: "rotate(8deg)", position: "relative"}}>
            <img src={leaves1} style={{width: "800px", height: "600px", objectFit: "contain", transform: "rotate(-8deg)"}}/>
          </div>
          <div>
            <h2 className="mb-4">Register</h2>
            
            <form onSubmit={(e) => handleRegister(e)}>
              <div className="mb-3">
                <Label htmlFor="username" >
                    Username
                </Label>
                
                <InputGroup>
                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-user" size="xs" style={{ color: 'grey'}} /></InputIcon>
                    <InputText type="text" name="username" id="username" placeholder="ludwighsmerre"   required />
                </InputGroup>
              </div>
              <div className="mb-3">
                <Label >
                  Name
                </Label>
                <InputGroup>
                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-signature" size="xs" style={{ color: 'grey'}} /></InputIcon>
                    <InputText type="text" name="firstName" id="firstName" placeholder="Ludwigh"  required />
                    <InputText type="text"name="lastName" id="lastName" placeholder="Smerre"  required />
                </InputGroup>
              </div>
              <div className="mb-3">
                <Label htmlFor="location">
                    Location
                </Label>
                <InputGroup>
                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-location-dot" size="xs" style={{ color: 'grey'}} /></InputIcon>
                    <InputText type="text"name="location" id="location" placeholder="Ghent"  required />
                </InputGroup>
              </div>
              <div className="mb-3">
                <Label htmlFor="email">
                    Email
                </Label>
                
                <InputGroup>
                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-envelope" size="xs" style={{ color: 'grey'}} /></InputIcon>
                    <InputText type="email" name="email" id="email" placeholder="ludwighsmerre@gmail.com"   required />
                </InputGroup>
              </div>
              <div className="mb-3">
                <Label htmlFor="password" >
                    Password
                </Label>
                <InputGroup>
                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-lock" size="xs" style={{ color: 'grey'}} /></InputIcon>
                    <InputText type={showPassword ? "text" : "password"}  name="password" id="password"  required />
                    <InputIcon><FontAwesomeIcon icon={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => setShowPassword(!showPassword)} style={{ color: 'grey'}}/></InputIcon>
                </InputGroup>

                
              </div>
              <div className="mb-3">
                <Label htmlFor="confirmpassword" >
                    Confirm Password
                </Label>
                <InputGroup>
                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-lock" size="xs" style={{ color: 'grey'}} /></InputIcon>
                    <InputText type={showConfirmPassword ? "text" : "password"}  name="confirmpassword" id="confirmpassword"  required />
                    <InputIcon><FontAwesomeIcon icon={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ color: 'grey' }}/></InputIcon>
                </InputGroup>
              </div>
                <div className="d-flex flex-column">
                    <Button type="submit" className="btn btn-primary">Register</Button>
                    <a href="/login">Already have an account?</a>
                </div>
            </form>
            {errorMessage && (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    )
}
export default Register