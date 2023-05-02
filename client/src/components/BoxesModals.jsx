import { memo } from 'react'
import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { DropdownButton, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import InfoButton from './InfoButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import COLORS from '../scripts/colors'

const OkButton = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`

const StyledDeleteButton = styled.button.attrs({
  className: `btn btn-danger`,
})`
  width: 40px;
  position: absolute;
  top: 15px;
  right: 15px;
  
`
const DeleteButton = ({ onClick }) => (
  <StyledDeleteButton onClick={onClick}>
      <FontAwesomeIcon icon="fa-solid fa-trash" flip size="sm" style={{ color: '#ffffff' }} />
  </StyledDeleteButton>
);


const CancelButton = styled.button.attrs({
  className: `btn btn-danger`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`


const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`
const InputTextSmall = styled.input.attrs({
  className: 'form-control',
})`
  margin: 0 5px 0 5px;
  width: 75px;
`

const InputSelect = styled.select.attrs({
  className: 'form-control',
})`
  margin: 5px;
`

const ContentBox = styled.div`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: 3px 3px 5px 5px rgba(0,0,0,0.3);
`

const ConnectionError = styled.li`
  display: inline-block;
  background-color: ${COLORS.errorColor};
  border-radius: 10px;
  padding: 10px;
  color: #fff;
`;

const ContentError = styled.li`
  display: inline-block;
  background-color: ${COLORS.warningColor};
  border-radius: 10px;
  padding: 10px;
  color: #fff;
`;

const ErrorListContainer = styled.ul`
  display: inline-block;
  border-radius: 10px;
  padding: 3px;
  margin-top: 5px;
  
  li {
    transition: all 0.2s ease-in-out;
  }

  li:hover {
    transform: scale(1.05);
  }
`;

const SmallButton = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin-right: 10px;
  width: 60px;
  font-size: 10px;
  transition: transform 0.2s ease-in-out;
  transform: ${props => (props.selected ? 'scale(1)' : 'scale(0.8)')};
  background-color: ${props => (props.selected ? COLORS.defaultColor : COLORS.defaultLightColor)};
  border-color: ${props => (props.selected ? COLORS.defaultColor : COLORS.defaultLightColor)};

  &:hover {
    transform: scale(1.2);
  }
`;


function useModalMethods(content, onOk, onCancel, onDelete) {
  const [updatedContent, setUpdatedContent] = useState(content);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedContent({ ...updatedContent, [name]: value });
  };

  const handleOkClick = () => {
    onOk(updatedContent);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleDeleteClick = () => {
    onDelete();
  };

  return {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  };
}

const ErrorList = ({ errors }) => {
  return (
    <ErrorListContainer>
      {errors.map(({ message, type }, index) => {
          if (type === 'content') {
            return <ContentError key={index}> <FontAwesomeIcon icon="fa-solid fa-circle-question" /> {message} </ContentError>;
          } else if (type === 'connection') {
            return <ConnectionError key={index}> <FontAwesomeIcon icon="fa-solid fa-circle-exclamation" /> {message} </ConnectionError>;
          } else {
            return null;
          }
      })}
    </ErrorListContainer>
  );
};

const LineModal = memo(function StartBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Line</h1>
      <p>Do you want to delete this line?</p>
      <OkButton onClick={handleCancelClick}>Cancel</OkButton>
      <CancelButton onClick={handleDeleteClick}>Delete</CancelButton>
    </ContentBox>
  );
});


const StartBoxModal = memo(function StartBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete, entities } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Start</h1>
      <p>Conenct blocks to this intial block to trigger an automation, first put a entity and after it a condition</p>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
    </ContentBox>
  );
});

const EntityBoxModal = memo(function EntityBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete, entities } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Entity</h1>

      <Label>Select a entity</Label>
      <InputSelect onChange={handleInputChange} name="entity_id" value={updatedContent.entity_id || "none" }>
        <option value="none" disabled>Select an option</option>
        {[...entities].map((sensor, index) => (
          <option key={index} value={sensor.entity_id}>{sensor.name}</option>
        ))}
      </InputSelect>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const CheckValueBoxModal = memo(function CheckValueBoxModal(props) {
  var { content, errors, onOk, onCancel, onDelete } = props;
  content =  {
    type: content?.type || "none",
    value: content?.value || "",
  }

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Value</h1>

      <Label>Set your condition</Label>
      <InputGroup>
        <InputSelect onChange={handleInputChange} name="type" value={updatedContent.type || "none" } >
          <option value="none" disabled>Select an option</option>
          <option value=">">{">"}</option>
          <option value="=">{"="}</option>
          <option value="<">{"<"}</option>
        </InputSelect>
        <InputText value={updatedContent.value} onChange={handleInputChange} type="text" name="value"/>
      </InputGroup>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});


const CheckStatusBoxModal = memo(function CheckStatusBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Status</h1>

      <Label>Set your condition</Label>
      
      <br></br>
      <input type="radio" name="status" value="active" checked={updatedContent.status=="active"} onChange={handleInputChange} />  Active
      <br></br>
      <input type="radio" name="status" value="inactive" checked={updatedContent.status=="inactive"} onChange={handleInputChange} />  Inactive

      <br></br>
      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});


const BasicActionBoxModal = memo(function BasicActionBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Basic Action</h1>

      <Label>Pick a action</Label>
      <InputSelect onChange={handleInputChange} name="type" value={updatedContent.type || "none" } >
          <option value="none" disabled>Select an option</option>
          <option value="turn_off">{"Turn off"}</option>
          <option value="turn_on">{"Turn on"}</option>
          <option value="toggle">{"Toggle"}</option>
      </InputSelect>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const AdvancedActionBoxModal = memo(function AdvancedActionBoxModal(props) {
  var { content, errors, onOk, onCancel, onDelete, connectionData } = props;
  content =  {
    service: content?.service || "",
    data: content?.data || "",
  }

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  const [serviceData, setServiceData] = useState({});
  const changeService = (event) => {
    const { value } = event.target;

    getSetService(value);
    handleInputChange(event);
  };
  

  const changeServiceData = (event) => {
    const { name, value } = event.target;
    updatedContent.data = {
      ...updatedContent.data,
      [name]: value,
    };
    setUpdatedContent({ ...updatedContent});
  };

  const getSetService = (name) => {
    if(!connectionData) return;
    let service = connectionData.find(obj => obj.service === name);
    if(!service) return;

    setServiceData(service.data);
  }

  useEffect( () => {
    getSetService(updatedContent.service);
  }, []);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Advanced Action</h1>

      <Label>Set your action</Label>
      
      <InputSelect onChange={changeService} name="service" value={updatedContent.service || "none" }>
        {connectionData.length == 0 ? (
          <option value="none" disabled>No services available for the entity</option>
        ) : (
          <option value="none" disabled>Select a service</option>
        )};
        
        {connectionData.length > 0 && connectionData.map((service, index) => (
          <option key={service.service} value={service.service}>{service.name}</option>
        ))}
      </InputSelect>
      
        {serviceData.length > 0 && serviceData.map((value, index) => (
          <div key={value} >
            <Label>{value.charAt(0).toUpperCase() + value.slice(1)}</Label>
            <InputText name={value} value={updatedContent.data[value]} onChange={changeServiceData} />
          </div>
        ))}
        

      <br></br>
      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const AndBoxModal = memo(function AndBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>And</h1>
      <p>This is a and block</p>

      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const OrBoxModal = memo(function OrBoxModal(props) {
  const { content, errors, onOk, onCancel, onDelete } = props;

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Or</h1>
      <p>This is a or block</p>

      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const TimeBoxModal = memo(function TimeBoxModal(props) {
  var { content, errors, onOk, onCancel, onDelete } = props;
  content =  {
    seconds: content?.seconds || "",
    minutes: content?.minutes || "",
    hours: content?.hours || "",
    repeatType: content?.repeatType || "",
    repeatValue: content?.repeatValue || "",
  }

  const [selectedView, setSelectedView] = useState(0);

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  const clickViewButton = (step) => {
    updatedContent.type = step;
    setSelectedView(step)
  }

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Time</h1>
      
      <SmallButton onClick={() => clickViewButton(0)} selected={selectedView == 0}>Specific</SmallButton>
      <SmallButton onClick={() => clickViewButton(1)} selected={selectedView == 1}>Repeat</SmallButton>
      <br></br>
      <br></br>
      {selectedView == 0 && (
        <>
          <Label>Time</Label>
          <InfoButton message="Vul hier de gewenste tijd in, vult u bijvoorbeeld enkel 10 minuten in zal dit elk uur afgaan op 10 na dat uur." />
          <div style={{ display: "flex", flexWrap: "nowrap" }}>
            <InputTextSmall value={updatedContent.hours} onChange={handleInputChange} type="text" placeholder="hour" name="hours"/>:
            <InputTextSmall value={updatedContent.minutes} onChange={handleInputChange} type="text" placeholder="min" name="minutes"/>:
            <InputTextSmall value={updatedContent.seconds} onChange={handleInputChange} type="text" placeholder="sec" name="seconds"/>
          </div>
        </>
      )}

      {selectedView == 1 && (
        <>
          <Label>Repeat every</Label>
          <InfoButton message="Herhaal elke X tijdseenheden." />
          <InputGroup>
            <InputText value={updatedContent.repeatValue} onChange={handleInputChange} type="text" name="repeatValue"/>
            <InputSelect onChange={handleInputChange} name="repeatType" value={updatedContent.repeatType || "none" } >
              <option value="none" disabled>Select an option</option>
              <option value="seconds">{"Seconds"}</option>
              <option value="minutes">{"Minutes"}</option>
              <option value="hours">{"Hours"}</option>
            </InputSelect>
          </InputGroup>
        </>
      )}

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});


const DelayBoxModal = memo(function DelayBoxModal(props) {
  var { content, errors, onOk, onCancel, onDelete } = props;
  content =  {
    time: content?.time || "",
  }

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Delay</h1>

      <Label>Fill in the delay</Label>
      <InfoButton message="Format hh:mm:ss:ms" />
      <InputText value={updatedContent.time} onChange={handleInputChange} type="text" placeholder="time" name="time"/>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const WeatherBoxModal = memo(function WeatherBoxModal(props) {
  var { content, errors, onOk, onCancel, onDelete } = props;
  content =  {
    status: content?.status || "",
  }

  const {
    updatedContent,
    handleInputChange,
    handleOkClick,
    handleCancelClick,
    handleDeleteClick,
    setUpdatedContent,
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Weather</h1>

      <Label>Fill in the weather</Label>
      <InfoButton message="Choose one of the available conditions" />

      {console.log(updatedContent.status)}
      <InputSelect onChange={handleInputChange} name="status" value={updatedContent.status || "none" } >
          <option value="none" disabled>Select an condition</option>
          <option value="clear,night">{"Clear or night"}</option>
          <option value="cloudy">{"Cloudy"}</option>
          <option value="fog">{"Fog"}</option>
          <option value="hail">{"Hail"}</option>
          <option value="lightning,rainy">{"Lightning and rainy"}</option>
          <option value="lightning">{"Lightning"}</option>
          <option value="partly clouded">{"Partly clouded"}</option>
          <option value="pouring">{"Pouring"}</option>
          <option value="rainy">{"Rainy"}</option>
          <option value="sneeuw-,regenachtig">{"Snowy and rainy"}</option>
          <option value="snowy">{"Snowy"}</option>
          <option value="sunny">{"Sunny"}</option>
          <option value="windy">{"Windy"}</option>
        </InputSelect>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick} />
    </ContentBox>
  )
});

const modalMap = {
  LineModal,
  StartBoxModal,
  EntityBoxModal,
  CheckValueBoxModal,
  CheckStatusBoxModal,
  BasicActionBoxModal,
  AdvancedActionBoxModal,
  AndBoxModal,
  OrBoxModal,
  TimeBoxModal,
  DelayBoxModal,
  WeatherBoxModal,
};

export default modalMap;