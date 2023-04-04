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

function Login() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [errorKey, setErrorKey] = useState(0);

    async function handleLogin(e) {
        e.preventDefault()

        const form = e.target;
        const user = {
            username: form[0].value,
            password: form[1].value
        }

        try {
            const res = await api.loginUser(user);
            const data = await res.data;

            // If something went wrong
            if(data.message != "Success"){
                setErrorMessage(data.message);
                setErrorKey((prevKey) => prevKey + 1);
                return;
            }

            // Store the new token and go back to the previous page
            localStorage.setItem("token", data.token);
            navigate(-1); 
        } catch(err) {
            setErrorMessage(err)
        }
    }

    return (
        <Wrapper>
                <Title>Login</Title>
                <form onSubmit={(e) => handleLogin(e)}>
                    <Label htmlFor="username">Username</Label>
                    <InputText type="text" name="username" id="username"/>
                    <Label htmlFor="password">Password</Label>
                    <InputText type="password" name="password" id="password" />

                    <div class="d-flex flex-column">
                        <Link href="/recovery">Forgot password?</Link>
                        <Link href="/register">Don't have an account yet?</Link>

                        <Button type="submit">Login</Button>
                    </div>
                </form>
                {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
        </Wrapper>
    )
}

export default Login;