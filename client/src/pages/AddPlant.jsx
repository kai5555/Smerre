import { useCallback, useState, useLayoutEffect } from 'react';
import Container from '../components/Container.jsx';
import CustomDragLayer from '../components/CustomDragLayer.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components'
import api from '../api';
import ValidationError from './ValidationError'
import { useNavigate} from 'react-router-dom';

const Title = styled.h1.attrs({
  className: 'h1',
})``

const Wrapper = styled.div.attrs({
  className: 'form-group',
})`
  margin: 0 30px;
`


const Info = styled.p`
  text-align: center;
`

const InputText = styled.input.attrs({
  className: 'form-control',
})`
  margin: 5px;
`

const Label = styled.label`
    margin: 5px;
`

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: 3px 3px 5px 5px rgba(0,0,0,0.3);
  max-width: 500px;
  margin: 0 auto;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const RadioButton = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  border: 2px dashed #c9c9c9;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9c9c9;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #22b542;
    color: #22b542;
    transform: scale(1.05);
  }

  ${(props) =>
    props.checked &&
    `
    border-color: #22b542;
    color: #22b542;
    transform: scale(1.1);
  `}
`;

const RadioTitle = styled.span`
  font-weight: bold;
  font-size: 16px;
  display: inline-block;
  text-align: center;
`;

const RadioText = styled.span`
  font-size: 12px;
  display: inline-block;
  text-align: center;
`;


const AddPlant = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const navigate = useNavigate();

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

  useLayoutEffect(() => {
    async function checkUserAuth() {
        try {
            const res = await api.isUserAuth({token: localStorage.getItem("token")});
            if(res.data.isLoggedIn) {
              console.log("Logged in");
            }
            else{
              console.log("Not logged in");
              navigate('/login');
            }
        } catch (err) {
          console.log(err);
        }
    }
    checkUserAuth();
  }, [navigate]);
 
  return (
    <>
      <Wrapper>
        <Title>Add plant</Title>
          <form onSubmit={(e) => handleSubmitPlant(e)}>
          <Label>Name</Label>
            <InputText type="text" name='name'></InputText>
            <Label>Description</Label>
            <InputText type="text" name='description'></InputText>
            <Label>Block</Label>
            <InputText type="text" name='block'></InputText>

            <Button type="submit">Submit</Button>
          </form>
      </Wrapper>
      {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
    </>
  );
};

export default AddPlant;
