import React, { useState } from 'react'
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
            if(data.message !== "Success"){
                setErrorMessage(data.message);
                setErrorKey((prevKey) => prevKey + 1);
                return;
            }

            navigate("/login"); 
        } catch(err) {
            setErrorMessage(err)
        }
    }
  
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