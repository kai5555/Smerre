import React, { Component, Fragment, useEffect, useLayoutEffect, useState } from 'react'
import api from '../api'
import ValidationError from './ValidationError'
import { useNavigate, useParams} from 'react-router-dom';

import styled from 'styled-components'
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
const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

function PasswordRecovery() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [errorKey, setErrorKey] = useState(0);

    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    async function handlePasswordRecovery(e) {
        e.preventDefault()

        const form = e.target;
        const payload = {
            user: param.id,
            token: param.token,
            password: form[0].value,
            confirmPassword: form[1].value
        }

        try {
            const res = await api.passwordRecovery(payload);
            const data = await res.data;

            // If something went wrong
            if(data.message != "Success"){
                setErrorMessage(data.message);
                setErrorKey((prevKey) => prevKey + 1);
                return;
            }

            navigate("/login"); 
        } catch(err) {
            setErrorMessage(err)
        }
    }

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try{    
                const payload = {
                    user: param.id,
                    token: param.token,
                }
                const res = await api.verifyPasswordRecovery(payload);
                console.log(res.data);
                setValidUrl(true);
            }catch(err){
                setValidUrl(false);
            }
        }
        verifyEmailUrl();
    },[param] );

    return (
        <Fragment>
            { validUrl ? (
                <Wrapper>

                    <div className="d-flex justify-content-center align-items-start vh-100">
                        <div className="p-5 rounded shadow-lg bg-white my-5" style={{ width: '400px' }}>
                            <h2 className="mb-4">Reset Password</h2>
                            <form onSubmit={(e)=>handlePasswordRecovery(e)}>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Password</label>
                                    <input className="form-control" type="password" name="password" id="password" />
                                </div>

                                <div className="form-group mb-3">
                                    <label htmlFor="password">Confirm Password</label>
                                    <input  className="form-control" type="password" name="password" id="confirmpassword" />
                                </div>

                                <Button type="submit" className="btn btn-primary mt-3">
                                    Reset Password
                                </Button>
                            </form>
                        </div>
                    </div>
                        {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
                </Wrapper>
            ) : (
                <h1>Not found</h1>
            )}

        </Fragment>
    )

}

export default PasswordRecovery;