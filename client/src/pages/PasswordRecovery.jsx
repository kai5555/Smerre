import React, { Component, useLayoutEffect, useState, useEffect } from 'react'
import api from '../api'
import ValidationError from './ValidationError'
import { useNavigate} from 'react-router-dom';

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
    width: 100px;
`

const Link = styled.a.attrs({
    className: ``,
})`
    margin: 5px 15px 0px 5px;
`

function PasswordRecovery() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [errorKey, setErrorKey] = useState(0);

    async function handlePasswordRecovery(e) {
        e.preventDefault()

        const form = e.target;
        const user = {
            email: form[0].value,
        }

        try {
            const res = await api.sendPasswordRecovery(user);
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
  
    useLayoutEffect(() => {
        async function checkUserAuth() {
            // try {
            //     console.log("TRIED LED");
            //     const response = await fetch('http://10.129.55.146:8123/api/config/automation/config/automation_tester', {
            //         method: 'POST',
            //         body: JSON.stringify({
            //             alias: "Nieuwe automatisering TESTER",
            //             description: "",
            //             trigger: {
            //                 platform: "state",
            //                 entity_id: "switch.magneetventiel"
            //             },
            //             condition: [],
            //             action: {
            //                 service: "switch.toggle",
            //                 data: {}
            //             },
            //             mode: "single"
            //         }),
            //         headers: {
            //             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
            //             'Content-Type': 'application/json',
            //         },
                    
            //     });
            // } catch (err) {
            //     console.log(err.errorMessage);
            // }

            // try {
            //     console.log("TRIED LED");
            //     const response = await fetch('http://10.129.55.146:8123/api/services/homeassistant/turn_off', {
            //         method: 'POST',
            //         body: JSON.stringify({
            //             "entity_id": "automation.nieuwe_automatisering",
            //         }),
            //         headers: {
            //             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
            //             'Content-Type': 'application/json',
            //         },
            //     });
            // } catch (err) {
            //     console.log(err.message);
            // }
            // try {
            //     console.log("TRIED LED");
            //     const response = await fetch('http://10.129.55.146:8123/api/services/automation/toggle', {
            //         method: 'POST',
            //         body: JSON.stringify({
            //             "entity_id": "automation.nieuwe_automatisering",
            //         }),
            //         headers: {
            //             "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2ZmE2NThhMzJlN2M0YTA5OTg1MzA5OTYzNTNhMGNlOCIsImlhdCI6MTY2OTcyNTgwNCwiZXhwIjoxOTg1MDg1ODA0fQ.PQsPlGsNVNxbYGwXfvsGi1k10rskekiDkayAD59gziw",
            //             'Content-Type': 'application/json',
            //         },
            //     });
            // } catch (err) {
            //     console.log(err.message);
            // }
        }
        checkUserAuth();
    },[]);

    return (
        <Wrapper>
                <Title>Reset password</Title>
                <form onSubmit={(e) => handlePasswordRecovery(e)}>
                    <Label htmlFor="email">Email</Label>
                    <InputText type="email" name="email" id="email" />

                    <Button type="submit">Reset</Button>
                </form>
                {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
        </Wrapper>
    )
}

export default PasswordRecovery;