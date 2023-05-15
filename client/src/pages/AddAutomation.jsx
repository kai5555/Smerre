import { useCallback, useState } from 'react';
import Container from '../components/Container.jsx';
import CustomDragLayer from '../components/CustomDragLayer.jsx';
import { DndProvider } from 'react-dnd';

import { TouchBackend } from 'react-dnd-touch-backend'
import styled from 'styled-components'
import api from '../api';
import ValidationError from './ValidationError'
import { useNavigate, Link} from 'react-router-dom';
import { withAuth } from './Authentication';


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
    console.log(automation);
    console.log(boxes);
    console.log(lines);
    
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
      let name = automationName.toLowerCase().replace(/\s+/g, '_');
      await api.getAutomationByName({name: name});

      setErrorMessage("Automation Name already exists");
      setErrorKey((prevKey) => prevKey + 1);
      return;

    } catch (error) {
      console.log(error);
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
      boxes: {"A":{"top":47,"left":911,"type":"Start","content":{"title":"If"},"errors":[],"step":0,"wrong":""},"B":{"top":66,"left":931,"type":"Start","content":{"title":"Then"},"errors":[],"step":1,"wrong":""},"C":{"top":176,"left":798,"title":"Entity","type":"Entity","content":{"entity_id":"sensor.espplant1_plant_temperature"},"errors":[],"step":0,"wrong":""},"D":{"top":347,"left":902,"title":"CheckValue","type":"CheckValue","content":{"type":">","value":"30"},"errors":[],"step":0,"wrong":""},"F":{"top":203,"left":848,"title":"Entity","type":"Entity","content":{"entity_id":"input_number.servo_control"},"errors":[],"step":1,"wrong":""},"G":{"top":363,"left":792,"title":"AdvancedAction","type":"AdvancedAction","content":{"service":"esphome.espkainielswout_control_servo","data":{"level":100}},"errors":[],"step":1,"wrong":""}},
    },
    {
      lines: {"AC1":{"start":{"left":407.421875,"top":50},"end":{"left":405.8203125,"top":110},"step":0,"wrong":["",""]},"CD1":{"start":{"left":405.8203125,"top":110},"end":{"left":404.484375,"top":236},"step":0,"wrong":["",""]},"BF1":{"start":{"left":511.046875,"top":79},"end":{"left":509.6640625,"top":170},"step":1,"wrong":["",""]},"FG1":{"start":{"left":509.6640625,"top":218},"end":{"left":512.859375,"top":345},"step":1,"wrong":["",""]}},
      boxes: {"A":{"top":70,"left":1010,"type":"Start","content":{"title":"If"},"errors":[],"step":0,"wrong":""},"B":{"top":78,"left":947,"type":"Start","content":{"title":"Then"},"errors":[],"step":1,"wrong":""},"C":{"top":187,"left":922,"title":"Entity","type":"Entity","content":{"entity_id":"sensor.generalesp_humidity"},"errors":[],"step":0,"wrong":""},"D":{"top":357,"left":996,"title":"CheckValue","type":"CheckValue","content":{"type":"<","value":"50"},"errors":[],"step":0,"wrong":""},"F":{"top":194,"left":846,"title":"Entity","type":"Entity","content":{"entity_id":"switch.espplant2_magneetventiel"},"errors":[],"step":1,"wrong":""},"G":{"top":353,"left":936,"title":"BasicAction","type":"BasicAction","content":{"type":"turn_on"},"errors":[],"step":1,"wrong":""}},
    },
    {
      lines: {"AC1":{"start":{"left":407.421875,"top":50},"end":{"left":406.34375,"top":106},"step":0,"wrong":["",""]},"CD1":{"start":{"left":406.34375,"top":106},"end":{"left":404.484375,"top":236},"step":0,"wrong":["",""]},"BF1":{"start":{"left":511.046875,"top":79},"end":{"left":512.3046875,"top":145},"step":1,"wrong":["",""]},"FG1":{"start":{"left":512.3046875,"top":145},"end":{"left":514.8515625,"top":317},"step":1,"wrong":["",""]},"GH1":{"step":1},"HI1":{"step":1},"IJ1":{"step":1}},
      boxes: {"A":{"top":56,"left":988,"type":"Start","content":{"title":"If"},"errors":[],"step":0,"wrong":""},"B":{"top":4,"left":945,"type":"Start","content":{"title":"Then"},"errors":[],"step":1,"wrong":""},"C":{"top":187,"left":888,"title":"Entity","type":"Entity","content":{"entity_id":"sensor.generalesp_temperature"},"errors":[],"step":0,"wrong":""},"D":{"top":362,"left":970,"title":"CheckValue","type":"CheckValue","content":{"type":">","value":"30"},"errors":[],"step":0,"wrong":""},"F":{"top":103,"left":862,"title":"Entity","type":"Entity","content":{"entity_id":"input_number.servo_control"},"errors":[],"step":1,"wrong":""},"G":{"top":237,"left":810,"title":"AdvancedAction","type":"AdvancedAction","content":{"service":"esphome.espkainielswout_control_servo","data":{"level":100}},"errors":[],"step":1,"wrong":""},"H":{"top":384,"left":910,"title":"Delay","type":"Delay","content":{"time":"00:00:10:00"},"errors":[],"step":1,"wrong":""},"I":{"top":522,"left":879,"title":"Entity","type":"Entity","content":{"entity_id":"input_number.servo_control"},"errors":[],"step":1,"wrong":""},"J":{"top":660,"left":827,"title":"AdvancedAction","type":"AdvancedAction","content":{"service":"esphome.espkainielswout_control_servo","data":{"level":"-100"}},"errors":[],"step":1,"wrong":""}}
    },
  ]
  return (
    <>
      {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
      {showDndProvider ? (
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
          <div>
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
            <p>Don't know how it works, here you can follow the <Link to="/automation/tutorial">tutorial</Link></p>
          </ContentBox>
        </>
      )}
    </>
  );
};

export default withAuth(AddAutomation);