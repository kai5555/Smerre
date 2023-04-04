import React, { Component, useLayoutEffect, useState, useEffect } from 'react'
import api from '../api'
import ValidationError from './ValidationError'
import { useNavigate} from 'react-router-dom';
import { DropdownButton, Dropdown, InputGroup, FormControl } from 'react-bootstrap';

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
    width: 150px;
`

const Link = styled.a.attrs({
    className: ``,
})`
    margin: 5px 15px 0px 5px;
`

function AddAutomation() {

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [errorKey, setErrorKey] = useState(0);

    const [triggers, setTriggers] = useState([]);
    const [selectedTriggerOptions, setSelectedTriggerOptions] = useState([]);
    const [conditions, setConditions] = useState([{ name: '', value: '' }]);
    const [selectedConditionOptions, setSelectedConditionOptions] = useState([]);
    const [actions, setActions] = useState([{ name: '', value: '' }]);
    const [selectedActionOptions, setSelectedActionOptions] = useState([]);

    const [sensors, setSensors] = useState([]);
    const [actors, setActors] = useState([]);

    useLayoutEffect(() => {
      async function checkUserAuth() {
          try {
              const res = await api.isUserAuth({token: localStorage.getItem("token")});
              if(res.data.isLoggedIn) {
                console.log("Logged in");
                setup();
              }
              else{
                console.log("Not logged in");
                navigate('/login');
              }
          } catch (err) {
              setErrorMessage(err)
          }
      }
      checkUserAuth();
    }, [navigate])  

    const setup = async () => {
        var res = await api.getAllSensors();
        setSensors(res.data.data);

        res = await api.getAllActors();
        setActors(res.data.data);
    }
    

    async function handleAddAutomation(e) {
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
    
    const handleAddTrigger = (option) => {
        setSelectedTriggerOptions((prevselectedTriggerOptions) => [...prevselectedTriggerOptions, option]);
        setTriggers((prevTriggers) => [...prevTriggers, option]);
    };

    const handleRemoveTrigger = index => {
        setSelectedTriggerOptions((prevselectedTriggerOptions) => prevselectedTriggerOptions.filter((_, i) => i !== index));
        setTriggers((prevTriggers) => prevTriggers.filter((_, i) => i !== index));
    };

    const handleTriggerNameChange = (event, index) => {
        const newTriggers = [...triggers];
        newTriggers[index].name = event.target.value;
        setTriggers(newTriggers);
    };

    const handleTriggerValueChange = (event, index) => {
        const newTriggers = [...triggers];
        newTriggers[index].value = event.target.value;
        setTriggers(newTriggers);
    };

    const handleAddCondition = () => {
        setConditions([...conditions, { name: '', value: '' }]);
    };

    const handleRemoveCondition = index => {
        const newConditions = [...conditions];
        newConditions.splice(index, 1);
        setConditions(newConditions);
    };

    const handleConditionNameChange = (event, index) => {
        const newConditions = [...conditions];
        newConditions[index].name = event.target.value;
        setConditions(newConditions);
    };

    const handleConditionValueChange = (event, index) => {
        const newConditions = [...conditions];
        newConditions[index].value = event.target.value;
        setConditions(newConditions);
    };

    const handleAddAction = () => {
        setActions([...actions, { name: '', value: '' }]);
    };

    const handleRemoveAction = index => {
        const newActions = [...actions];
        newActions.splice(index, 1);
        setActions(newActions);
    };

    const handleActionNameChange = (event, index) => {
        const newActions = [...actions];
        newActions[index].name = event.target.value;
        setActions(newActions);
    };

    const handleActionValueChange = (event, index) => {
        const newActions = [...actions];
        newActions[index].value = event.target.value;
        setActions(newActions);
    };

    return (
        <Wrapper>
            <Title>Add Automation</Title>
            <form onSubmit={(e) => handleAddAutomation(e)}>

                <Label htmlFor="username">Name</Label>
                <InputText type="text" name="username" id="username"/>
                <br></br>
                
                <h2>Trigger</h2>
                <div>
                    <DropdownButton title="Add trigger" onSelect={handleAddTrigger}>
                        <Dropdown.Item eventKey="waarde">Waarde</Dropdown.Item>
                        <Dropdown.Item eventKey="option-2">Option 2</Dropdown.Item>
                        <Dropdown.Item eventKey="option-3">Option 3</Dropdown.Item>
                    </DropdownButton>

                    {triggers.map((trigger, index) => (
                        <div key={index}>
                        {selectedTriggerOptions[index] === 'waarde' && 
                            <>
                                <select className="form-select" aria-label="Default select example">
                                    {[...sensors, ...actors].map((sensor, index) => (
                                        <option key={index} value={sensor.entity_id}>{sensor.name}</option>
                                    ))}
                                </select>
                                <InputGroup>
                                    <DropdownButton
                                        as={InputGroup.Prepend}
                                        variant="outline-secondary"
                                        title="Selector"
                                        id="input-group-dropdown-1"
                                    >
                                        <Dropdown.Item href=">">{'>'}</Dropdown.Item>
                                        <Dropdown.Item href=">=">{'>='}</Dropdown.Item>
                                        <Dropdown.Item href="=">{'='}</Dropdown.Item>
                                        <Dropdown.Item href="<=">{'<='}</Dropdown.Item>
                                        <Dropdown.Item href="<">{'<'}</Dropdown.Item>
                                    </DropdownButton>
                                    <FormControl aria-describedby="basic-addon1" />
                                </InputGroup>
                            </>  
                        }
                        {selectedTriggerOptions[index] === 'option-2' &&
                            <p>Hi 2</p>  
                        
                        }
                        {selectedTriggerOptions[index] === 'option-3' && 
                            <p>Hi 3</p>
                        
                        }
                        <Button type="button" onClick={() => handleRemoveTrigger(index)}>Remove</Button>
                        </div>
                    ))}
                </div>
                <br></br>

                <h2>Condition</h2>
                {conditions.map((condition, index) => (
                    <div key={index}>
                        <InputText
                        type="text"
                        placeholder="Name"
                        value={condition.name}
                        onChange={event => handleConditionNameChange(event, index)}
                        />
                        <InputText
                        type="text"
                        placeholder="Phone"
                        value={condition.phone}
                        onChange={event => handleConditionValueChange(event, index)}
                        />
                        {index > 0 && (
                            <Button type="button" onClick={() => handleRemoveCondition(index)}>Remove</Button>
                        )}
                    </div>
                ))}
                <Button type="button" onClick={handleAddCondition}>Add condition</Button>
                <br></br>

                <h2>Action</h2>
                {actions.map((action, index) => (
                    <div key={index}>
                        <InputText
                        type="text"
                        placeholder="Name"
                        value={action.name}
                        onChange={event => handleActionNameChange(event, index)}
                        />
                        <InputText
                        type="text"
                        placeholder="Phone"
                        value={action.phone}
                        onChange={event => handleActionValueChange(event, index)}
                        />
                        {index > 0 && (
                            <Button type="button" onClick={() => handleRemoveAction(index)}>Remove</Button>
                        )}
                    </div>
                ))}
                <Button type="button" onClick={handleAddAction}>Add action</Button>

                <br></br>
                <Button type="submit">Add</Button>
            </form>
            {/* {errorMessage && <ValidationError key={errorKey} message={errorMessage} />} */}
        </Wrapper>
    );
}


export default AddAutomation;