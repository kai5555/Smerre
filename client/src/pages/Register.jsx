import React, { useLayoutEffect, useState } from 'react'
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
`

function Register () {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [errorKey, setErrorKey] = useState(0);

    async function handleRegister(e) {
        e.preventDefault()

        const form = e.target
        const user = {
            username: form[0].value,
            firstName: form[1].value,
            lastName: form[2].value,
            email: form[3].value,
            password: form[4].value,
            confirmPassword: form[5].value
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
        <Wrapper>
            <Title>Register</Title>
            <form onSubmit={(e) => handleRegister(e)}>
                <Label htmlFor="username">Username</Label>
                <InputText type="text" name="username" id="username"/>
                <Label htmlFor="firstName">First Name</Label>
                <InputText type="text" name="firstName" id="firstName"/>
                <Label htmlFor="lastName">Last Name</Label>
                <InputText type="text" name="lastName" id="lastName"/>
                <Label htmlFor="email">Email</Label>
                <InputText type="email" name="email" id="email"/>
                <Label htmlFor="password">Password</Label>
                <InputText type="password" name="password" id="password" />
                <Label htmlFor="password">Confirm Password</Label>
                <InputText type="password" name="password" id="confirmpassword" />
                <Button type="submit">Register</Button>
            </form>
            {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
        </Wrapper>
    )
}
export default Register