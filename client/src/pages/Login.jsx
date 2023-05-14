import React, {  useState, useEffect } from 'react'
import api from '../api'

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'


import logo from '../images/smerre_logo.png'
import leaves1 from '../images/leaves1.jpg'
import COLORS from '../scripts/colors'

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    width: 100px;
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

function Login() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    async function handleLogin(e) {
        e.preventDefault();

        const form = e.target;
        const user = {
            username: form[0].value,
            password: form[1].value,
        };

        try {
            const res = await api.loginUser(user);
            const data = await res.data;

            // If something went wrong
            if (data.message !== 'Success') {
                setErrorMessage(data.message);
                return;
            }

            // Store the new token and go back to the previous page
            localStorage.setItem('token', data.token);
            await new Promise(resolve => window.location.reload(resolve));

        } catch (err) {
            setErrorMessage(err.message);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
                navigate("/");
            }
    }, []);

    return (
        <div className="row d-flex justify-content-center align-items-start vh-100">
            <div className=" p-0 rounded shadow-lg bg-white my-5 d-sm-flex overflow-hidden col-xl-6 col-xxl-5 col-md-8 col-10" style={{ minHeight:"400px"}}>
                <div className="flex-grow-1 overflow-hidden  bg-black position-relative me-4 col-1 d-none d-sm-block" style={{clipPath: "polygon(0 0, 100% 0, 92% 100%, 0% 100%)"}} >
                    <img src={leaves1} style={{ position: "absolute", top: 0, left: 0, height: "100%", objectFit: "contain"}}/>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",  width: "40%", height: "40%"  }}>
                        <img src={logo} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", position: "absolute", top: "50%", left: "55%", transform: "translate(-50%, -50%)"}}/>
                    </div>
                </div>

                <div className="d-sm-none bg-black position-relative" style={{ height: "100px", width: "100%" }}>
                    <img src={leaves1} style={{ height: "100%", width: "100%", objectFit: "none" }} />
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", height: "80%" }}>
                        <img src={logo} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
                    </div>
                </div>

                <div className="d-flex text-center text-sm-start">
                <div className="my-sm-5 my-3 mx-auto pe-3">
                    <h2 className="mb-sm-4 mb-2 ">Login</h2>
                    <form onSubmit={(e) => handleLogin(e)}>
                        <div className="form-group mb-3">
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" name="username" required />
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" required />
                        </div>

                        <Button type="submit" className="btn btn-primary my-3">
                            Login
                        </Button>

                        <div className="d-flex flex-column">
                            <a href="/recovery">Forgot password?</a>
                            <a href="/register">Don't have an account yet?</a>
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
        </div>
    );

}

export default Login;