import React, { useState } from 'react'
import api from '../api'
import { useNavigate} from 'react-router-dom';
import styled from 'styled-components'
import COLORS from '../scripts/colors'

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

                    <Button type="submit" className="btn btn-primary mt-3">
                        Reset Password
                    </Button>
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