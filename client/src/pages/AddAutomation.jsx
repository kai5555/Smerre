import { useCallback, useState, useLayoutEffect } from 'react';
import Container from '../components/Container.jsx';
import CustomDragLayer from '../components/CustomDragLayer.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components'
import api from '../api';
import ValidationError from './ValidationError'
import { useNavigate} from 'react-router-dom';

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 100px;
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


const AddAutomation = () => {
  const [showDndProvider, setShowDndProvider] = useState(false);
  const [automationName, setAutomationName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const navigate = useNavigate();

  const handleContainerSubmitCall = useCallback(async (automation, lines, boxes) => {
    await api.createAutomation({automation, automationName, lines, boxes});
    navigate('/automation');
  }, [automationName]);

  const handleNextButtonClick = useCallback(async () => {
    if(automationName === ''){
      setErrorMessage("Automation Name can't be empty");
      setErrorKey((prevKey) => prevKey + 1);
      return;
    }

    // Check if name doesn't already exist
    try {
      await api.getAutomationByName(automationName);

      setErrorMessage("Automation Name can't be empty");
      setErrorKey((prevKey) => prevKey + 1);
      return;

    } catch (error) {
      if (error.response.status !== 404) {
        setErrorMessage("An eror occured: " + error.message);
        setErrorKey((prevKey) => prevKey + 1);
        return;
      }
    }

    setShowDndProvider(true);
  }, [automationName]);

  const handleAutomationNameChange = useCallback((event) => {
    setAutomationName(event.target.value);
  }, []);

  const handleTemplateSelect = useCallback((index) => {
    setSelectedTemplate(index);
  }, []);

  const templates = [
    null,
    {
      lines: {"AC1":{"start":{"left":407.421875,"top":50},"end":{"left":406.34375,"top":106},"step":0,"wrong":["",""]},"CD1":{"start":{"left":406.34375,"top":106},"end":{"left":404.484375,"top":236},"step":0,"wrong":["",""]},"BF1":{"start":{"left":511.046875,"top":79},"end":{"left":512.3046875,"top":145},"step":1,"wrong":["",""]},"FG1":{"start":{"left":512.3046875,"top":145},"end":{"left":514.8515625,"top":317},"step":1,"wrong":["",""]}},
      boxes: {"A":{"top":20,"left":380,"type":"Start","content":{"title":"Als"},"errors":[],"step":0,"wrong":""},"B":{"top":49,"left":480,"type":"Start","content":{"title":"Dan"},"errors":[],"step":1,"wrong":""},"C":{"top":96,"left":302,"title":"Entity","type":"Entity","content":{"entity_id":"sensor.esp2_temperature"},"errors":[],"step":0,"wrong":""},"D":{"top":226,"left":368,"title":"CheckValue","type":"CheckValue","content":{"type":">","value":"30"},"errors":[],"step":0,"wrong":""},"F":{"top":135,"left":398,"title":"Entity","type":"Entity","content":{"entity_id":"input_number.servo_control"},"errors":[],"step":1,"wrong":""},"G":{"top":307,"left":435,"title":"AdvancedAction","type":"AdvancedAction","content":{"service":"espkainielswout_control_servo","data":"{\"level\": 100}"},"errors":[],"step":1,"wrong":""}},
    },
    {
      lines: {"AC1":{"start":{"left":407.421875,"top":50},"end":{"left":405.8203125,"top":110},"step":0,"wrong":["",""]},"CD1":{"start":{"left":405.8203125,"top":110},"end":{"left":404.484375,"top":236},"step":0,"wrong":["",""]},"BF1":{"start":{"left":511.046875,"top":79},"end":{"left":509.6640625,"top":170},"step":1,"wrong":["",""]},"FG1":{"start":{"left":509.6640625,"top":218},"end":{"left":512.859375,"top":345},"step":1,"wrong":["",""]}},
      boxes: {"A":{"top":20,"left":380,"type":"Start","content":{"title":"Als"},"errors":[],"step":0,"wrong":""},"B":{"top":49,"left":480,"type":"Start","content":{"title":"Dan"},"errors":[],"step":1,"wrong":""},"C":{"top":100,"left":334,"title":"Entity","type":"Entity","content":{"entity_id":"sensor.humidity"},"errors":[],"step":0,"wrong":""},"D":{"top":226,"left":368,"title":"CheckValue","type":"CheckValue","content":{"type":"<","value":"50"},"errors":[],"step":0,"wrong":""},"F":{"top":160,"left":415,"title":"Entity","type":"Entity","content":{"entity_id":"switch.Magneetventiel"},"errors":[],"step":1,"wrong":""},"G":{"top":335,"left":451,"title":"BasicAction","type":"BasicAction","content":{"type":"turn_on"},"errors":[],"step":1,"wrong":""}},
    },
    null,
  ]

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
      {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
      {showDndProvider ? (
        <DndProvider backend={HTML5Backend}>
          <div>
            {console.log(templates[selectedTemplate])}
            <Container onSubmitCall={handleContainerSubmitCall} automation={templates[selectedTemplate]}/>
            <CustomDragLayer />
          </div>
        </DndProvider>
      ) : (
        <>
          <Title>Create a new automation</Title>
          <ContentBox>
            <Info>Welcome to the automation creator! Please enter a name for your automation:</Info>
            <Label>Automation Name</Label>
            <InputText type="text" name="automationName" onChange={handleAutomationNameChange}></InputText>

            <Label>Automation Template</Label>
            <RadioButtonContainer>
              <RadioButton checked={selectedTemplate === 0} onClick={() => handleTemplateSelect(0)}>
                <RadioTitle>Blank automation</RadioTitle>
                <RadioText>Create a empty project</RadioText>
              </RadioButton>
              <hr style={{margin: "0 0 0 0"}}></hr>
              <RadioButton checked={selectedTemplate === 1} onClick={() => handleTemplateSelect(1)}>
                <RadioTitle>Window automation</RadioTitle>
                <RadioText>Create a project toggeling a servo on temperature</RadioText>
              </RadioButton>
              <RadioButton checked={selectedTemplate === 2} onClick={() => handleTemplateSelect(2)}>
                <RadioTitle>Water automation</RadioTitle>
                <RadioText>Create a project toggling the watersystem on soil humidity</RadioText>
              </RadioButton>
              <RadioButton checked={selectedTemplate === 3} onClick={() => handleTemplateSelect(3)}>
                <RadioTitle>Weather automation</RadioTitle>
                <RadioText>Create a automation based on the weather predictions</RadioText>
              </RadioButton>
            </RadioButtonContainer>
            <Button onClick={handleNextButtonClick}>Next</Button>
          </ContentBox>
        </>
      )}
    </>
  );
};

export default AddAutomation;
