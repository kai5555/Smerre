import { memo } from 'react'
import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import api from '../api'
import { DropdownButton, Dropdown, InputGroup, FormControl } from 'react-bootstrap';

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

const ContentBox = styled.div.attrs({

})`
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: 3px 3px 5px 5px rgba(0,0,0,0.3);
`

export const EntityBoxModal = memo(function EntityBoxModal(props) {
  const { content, onOk, onCancel, onDelete } = props;

  const [updatedContent, setUpdatedContent] = useState(content);
  const [sensors, setSensors] = useState([]);
  const [actors, setActors] = useState([]);
  
  // Get all the sensors and actors
  useEffect(() => {
    async function getAllEntities() {
        try {
          var res = await api.getAllSensors();
          setSensors(res.data.data);
  
          res = await api.getAllActors();
          setActors(res.data.data);

        } catch (err) {

        }
    }
    getAllEntities();
  }, [])  

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
  }

  return (
    <ContentBox>
      <h1>Entity</h1>

      <Label>Select a entity</Label>
      <InputSelect onChange={handleInputChange} name="entity_id" id="entity_id" value={updatedContent.entity_id || "none" }>
        <option value="none" disabled>Select an option</option>
        {[...sensors, ...actors].map((sensor, index) => (
          <option key={index} value={sensor.entity_id}>{sensor.name}</option>
        ))}
      </InputSelect>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
    </ContentBox>
  )
});

export const IfBoxModal = memo(function IfBoxModal(props) {
  const { content, onOk, onCancel, onDelete } = props;

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
  }

  return (
    <ContentBox>
      <h1>If statement</h1>

      <Label>Set your condition</Label>
      <InputGroup>
        <InputSelect onChange={handleInputChange} name="type" id="type" value={updatedContent.type || "none" } >
          <option value="none" disabled>Select an option</option>
          <option value=">">{">"}</option>
          <option value=">=">{">="}</option>
          <option value="=">{"="}</option>
          <option value="<=">{"<="}</option>
          <option value="<">{"<"}</option>
        </InputSelect>
        <InputText value={updatedContent.value} onChange={handleInputChange}type="text" name="value" id="value"/>
      </InputGroup>

      <OkButton onClick={handleOkClick}>Oké</OkButton>
      <CancelButton onClick={handleCancelClick}>Cancel</CancelButton>
      <DeleteButton onClick={handleDeleteClick}>X</DeleteButton>
    </ContentBox>
  )
});

export const StartBoxModal = memo(function StartBoxModal(props) {
  const { content } = props;

  return (
    <ContentBox>
      <h1>Trigger</h1>
      <p>Conenct blocks to this intial block to trigger an automation, first put a entity and after it a condition</p>
    </ContentBox>
  );
});
