import React, { Fragment, useEffect, useState } from 'react'
import api from '../api'
import {  useParams } from 'react-router-dom'

function EmailVerify() {
    const [validUrl, setValidUrl] = useState(false);
    const param = useParams();

    useEffect(() => {
        const verifyEmailUrl = async () => {
            try{    
                const payload = {
                    user: param.id,
                    token: param.token,
                }
                const res = await api.verifyEmailUser(payload);
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
                <h1>Email verified successfully</h1>
            ) : (
                <h1>Not found </h1>
            )}
        </Fragment>
    )
}

export default EmailVerify;
