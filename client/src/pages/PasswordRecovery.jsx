import React, { useState } from 'react'
import api from '../api'
import ValidationError from './ValidationError'
import { useNavigate} from 'react-router-dom';

/*import styled from 'styled-components'

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
`*/

function PasswordRecovery() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    async function handlePasswordRecovery(e) {
        e.preventDefault();

        const form = e.target;
        const user = {
            email: form.email.value,
        };

        try {
            const res = await api.sendPasswordRecovery(user);
            const data = await res.data;

            if (data.message !== 'Success') {
                setErrorMessage(data.message);
                return;
            }

            navigate('/login');
        } catch (err) {
            setErrorMessage('Something went wrong. Please try again later.');
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-start vh-100">
            <div className="p-5 rounded shadow-lg bg-white my-5" style={{ width: '400px' }}>
                <h2 className="mb-4">Reset Password</h2>
                <form onSubmit={(e)=>handlePasswordRecovery(e)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input type="email" className="form-control" id="email" name="email" required />
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                        Reset Password
                    </button>
                </form>

                {errorMessage && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PasswordRecovery;