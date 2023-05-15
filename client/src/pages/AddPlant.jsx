import React, { useState, useEffect} from 'react';

import styled from 'styled-components'
import api from '../api';
import ValidationError from './ValidationError'
import { useNavigate} from 'react-router-dom';
import { withAuth } from './Authentication';
import {InputGroup} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import COLORS from "../scripts/colors";
import plant from "../images/plant.jpg";
import plant_cut from "../images/plant_cut.jpg";
import LoadingSpinner from "../components/LoadingSpinner";


const InputText = styled.input.attrs({
  className: 'form-control',
})``

const InputSelect = styled.select.attrs({
    className: 'form-control',
})``

const Label = styled.label`
    margin: 5px;
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


const InputIcon = styled(InputGroup.Text)`
    background-color: #ffff;
`

const AddPlant = () => {
    const [blockNumbers, setBlockNumbers] = useState([]);
    const[loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const navigate = useNavigate();

    const setup = async () => {
        try {
            const res = await api.getAllPlants();
            console.log(res);
            const tempBlockNumbers = res.data.data.map((plant)=> plant.block);
            setBlockNumbers(tempBlockNumbers);
            console.log(tempBlockNumbers);
            setLoading(false);
        } catch (err) {
            console.log('Something went wrong while fetching plants!');
        }
    };

    useEffect( () => {
        setup();
    },[])

  async function handleSubmitPlant(e) {
    e.preventDefault()

    const form = e.target;
    const plant = {
        name: form[0].value,
        description: form[1].value,
        block: form[2].value,
    }

    try {
        const res = await api.createPlant(plant);
        const data = await res.data;

        // If something went wrong
        if(!data.success){
          console.log(data);
            setErrorMessage(data.message);
            setErrorKey((prevKey) => prevKey + 1);
            return;
        }
        navigate("/plant");
    } catch(err) {
        setErrorMessage(err)
    }
}
    if(loading){
        return (<LoadingSpinner/>)
    }
    return (
        <div className="row d-flex justify-content-center align-items-start vh-100">
            <div className=" p-0 rounded shadow-lg bg-white my-5 d-sm-flex overflow-hidden col-xxl-6 col-xl-7 col-lg-8 col-md-9 col-10" style={{ minHeight:"400px"}}>
                <div className="flex-grow-1 overflow-hidden position-relative me-4 col-1 d-none d-sm-block" style={{clipPath: "polygon(100% 0, 85% 50%, 100% 100%, 0 100%, 0 0)", maxWidth:"500px", backgroundColor:"#CCCFCC"}} >
                    <img src={plant} style={{ position: "absolute", top: 0, left: 0, height: "100%", objectFit: "contain"}}/>
                </div>

                <div className="d-sm-none position-relative d-flex justify-content-between" style={{ height: "100px", width: "100%" ,  backgroundColor:"#CCCFCC"}}>
                    <img src={plant_cut} style={{ height: "100%", transform:"scaleX(-1)"}} />
                    <img src={plant_cut} style={{ height: "100%"}} />
                </div>

                <div className="d-flex text-center mx-auto text-sm-start">
                    <div className="my-sm-5 my-3 mx-auto px-3">
                        <h2 className="mb-sm-4 mb-2 ">Add plant</h2>

                        <form onSubmit={(e) => handleSubmitPlant(e)}>
                            <div className="mb-3">
                                <Label >
                                    Name
                                </Label>
                                <InputGroup>
                                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-signature" size="xs" style={{ color: 'grey'}} /></InputIcon>
                                    <InputText type="text" name="name" placeholder="monstera deliciosa"  required />
                                </InputGroup>
                            </div>
                            <div className="mb-3">
                                <Label >
                                    Description
                                </Label>
                                <InputGroup>
                                    <InputIcon><FontAwesomeIcon icon="fa-solid fa-file-lines" size="xs" style={{ color: 'grey'}} /></InputIcon>
                                    <InputText type="text" name="description" placeholder="description of the plant"  required />
                                </InputGroup>
                            </div>
                            <div className="mb-3">
                                <Label >
                                    Block number
                                </Label>
                                <InputGroup>
                                    <InputIcon>
                                        <FontAwesomeIcon icon="fa-solid fa-network-wired" size="xs" style={{ color: 'grey' }} />
                                    </InputIcon>
                                    <InputSelect name="block" required>
                                        <option value="" disabled>Select block number</option>
                                        {[...Array(Math.max(...blockNumbers) + 1)].map((_, index) => {
                                            const number = index + 1;
                                            if (number === 0) {
                                                return null; // Exclude 0 and numbers in blockNumbers from the dropdown
                                            }
                                            return (
                                                <option key={number} value={number} disabled={blockNumbers.includes(number)}>
                                                    {number}
                                                </option>
                                            );
                                        })}
                                    </InputSelect>
                                </InputGroup>
                            </div>
                            <div className="d-flex flex-column">
                                <Button type="submit" className="btn btn-primary">Add plant</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div  className=" container d-flex align-items-center justify-content-center vh-100">
                {errorMessage && (
                    <ValidationError
                        key={errorKey}
                        message={errorMessage}
                        className="text-center"
                        style={{ maxWidth: '400px', padding: '20px' }}
                    />
                )}
            </div>
        </div>
    );
};


export default withAuth(AddPlant);
