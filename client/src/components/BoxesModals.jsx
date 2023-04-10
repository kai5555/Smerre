import { memo } from 'react'
import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { DropdownButton, Dropdown, InputGroup, FormControl } from 'react-bootstrap';

const wrongConnectionColor = "#9c2828";
const wrongContentColor = "#ff9933";

const OkButton = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`

const DeleteButton = styled.button.attrs({
  className: `btn btn-danger`,
})`
  width: 40px;
  position: absolute;
  top: 15px;
  right: 15px;
`


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

const ConnectionError = styled.div`
  display: inline-block;
  background-color: ${wrongConnectionColor};
  border-radius: 10px;
  padding: 10px;
  color: #fff;
`;

const ContentError = styled.div`
  display: inline-block;
  background-color: ${wrongContentColor};
  border-radius: 10px;
  padding: 10px;
  color: #fff;
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
  };
}

const ErrorList = ({ errors }) => {
  return (
    <ul>
      {errors.map(({ message, type }, index) => {
        if (type === 'content') {
          return <ContentError key={index}> (X) {message} </ContentError>;
        } else if (type === 'connection') {
          return <ConnectionError key={index}> (!) {message} </ConnectionError>;
        } else {
          return null;
        }
      })}
    </ul>
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
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
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
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
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
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
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
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
    </ContentBox>
  )
});

const AdvancedActionBoxModal = memo(function AdvancedActionBoxModal(props) {
  var { content, errors, onOk, onCancel, onDelete } = props;
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
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Advanced Action</h1>

      <Label>Set your action</Label>
      
      <InputText value={updatedContent.service} onChange={handleInputChange}type="text" name="service" placeholder="Service name"/>
      <InputText value={updatedContent.data} onChange={handleInputChange}type="text" name="data" placeholder="Data as json format"/>

      <br></br>
      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
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
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>And</h1>
      <p>This is a and block</p>

      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
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
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Or</h1>
      <p>This is a or block</p>

      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
    </ContentBox>
  )
});

const TimeBoxModal = memo(function TimeBoxModal(props) {
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
  } = useModalMethods(content, onOk, onCancel, onDelete);

  return (
    <ContentBox>
      <ErrorList errors={errors} />
      <h1>Time</h1>

      <Label>Set your time conditions</Label>
      <InputText value={updatedContent.time} onChange={handleInputChange} type="text" name="time"/>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
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
};

export default modalMap;