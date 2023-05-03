import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate} from 'react-router-dom';
import { withAuth } from './Authentication';
import DeletePopup from "../components/DeletePopup";

const AutomationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
`;

const AutomationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  width: 250px;
  text-align: center;
  position: relative;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ButtonBox = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  align-items: center;
`;

const AutomationName = styled.div`
  font-size: 12px;
`;

const AutomationAlias = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const DeleteButton = styled.button`
  background-color: #FF4136;
  border: none;
  color: white;
  padding: 2px 6px;
  border-radius: 5px;
  margin-right: 2px;
  cursor: pointer;
  font-size: 10px;

  &:hover {
    background-color: #E71D36;
  }
`;

const ToggleBox = styled.div`
  background-color: ${props => props.enabled ? "#22b542" : "#ccc"};
  width: 17px;
  height: 19px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.enabled ? "#1f9138" : "#bababa"};;
  }
`;

const Automations = () => {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState(null);

  const handleAutomationClick = useCallback((name) => {
    window.location.href = `/automation/${name}/edit`;
  }, []);

  const handleNewAutomationClick = useCallback(() => {
    window.location.href = `/automation/add`;
  }, []);

  const handleToggleAutomation = useCallback(async (name, enabled) => {
    setAutomations((prev) =>
        prev.map((automation) =>
            automation.name === name
                ? { ...automation, enabled}
                : automation
        )
    );

    await api.toggleAutomation({automationName: name});


  }, []);


  const handleDeleteAutomation = useCallback(async (name) => {
    setAutomationToDelete(name);
    setShowDeletePopup(true);
  }, []);

  const handleConfirmDelete = useCallback(async (name) => {
    await api.deleteAutomation({automationName: name});

    setAutomations((prevAutomations) =>
      prevAutomations.filter((automation) => automation.name !== name)
    );

    setAutomationToDelete(null);
    setShowDeletePopup(false);
  }, []);

  const handleCancelDelete = () => {
    setAutomationToDelete(null);
    setShowDeletePopup(false);
  };

  // Get all the automations
  const setup = async () => {
    try {
      const res = await api.getAllAutomations();
      setAutomations(res.data.data);
    } catch (err) {
      console.log("Something went wrong while fetching automations!");
    }
  }
  useEffect( () => {
    setup();
}, []);


//  return (
//    <AutomationsContainer>
//    {automations.map(({ name, alias, enabled }) => (
//      <AutomationWrapper key={name}>
//        <div onClick={() => handleAutomationClick(name)}>
//          <AutomationAlias>{alias}</AutomationAlias>
//          <AutomationName>{name}</AutomationName>
//        </div>
//        <ButtonBox>
//          <DeleteButton onClick={() => handleDeleteAutomation(name)}>x</DeleteButton>
//          <ToggleBox enabled={enabled || false} onClick={() => handleToggleAutomation(name, !enabled)} />
//        </ButtonBox>
//      </AutomationWrapper>
//    ))}
//    <AutomationWrapper style={{background: "#22b542"}} onClick={() => handleNewAutomationClick()}>
//      <AutomationAlias>+ New automation</AutomationAlias>
//    </AutomationWrapper>
//    </AutomationsContainer>
//  );

  return(
      <div className="container my-3 ">
        <div className="row mb-1">
          <div className="col-6"><h1 className="h2 mb-4">Automations</h1></div>
          <div className="col-6 text-end">
            <button type="button" className="btn mt-2 pt-1 "
                    style={{color:"white", backgroundColor:"MediumSeaGreen"}}
                    onClick={() => handleNewAutomationClick()}
            >Add automation</button>
          </div>
        </div>
        {automations.length === 0 && <p>No automations found.</p>}
        <div className="row">
          {automations.map(({ name, alias, enabled }) => (
              <div className="col-md-12 col-lg-12" key={name}>
                <div className="card shadow-sm mb-5 " style={{minHeight: "150px"}}>
                  <div className="card-body pt-0">

                    <div className="row">
                      <div className="col-6 pt-3 pe-0">
                        <h5 className="card-title">{name}</h5>
                        <p className="card-text">{alias}</p>
                      </div>


                    <div className="col-6 text-end ps-0 pe-2 pt-2">
                      <i className="bi bi-power" style={{fontSize: "2rem", cursor: "pointer",
                        color: enabled ? "MediumSeaGreen" : "LightGrey"}}
                        onClick={() => handleToggleAutomation(name, !enabled)}
                    ></i>
                    </div>
                  </div>

                </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <button className="btn btn-outline-secondary" onClick={() => handleAutomationClick(name)}>
                      Details
                    </button>
                    <i className="bi bi-trash text-danger" style={{fontSize:"1.4rem", cursor:"pointer"}} onClick={() => handleDeleteAutomation(name)}></i>
                  </div>
                </div>
              </div>
          ))}
        </div>
        {showDeletePopup && (
            <DeletePopup plantName={automationToDelete} onDelete={handleConfirmDelete} onCancel={handleCancelDelete} />
        )}
      </div>
  );
};



export default withAuth(Automations);
