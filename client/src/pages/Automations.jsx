import { useCallback, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate} from 'react-router-dom';

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

  const handleAutomationClick = useCallback((name) => {
    window.location.href = `/automation/${name}/edit`;
  }, []);

  const handleNewAutomationClick = useCallback(() => {
    window.location.href = `/automation/add`;
  }, []);

  const handleToggleAutomation = useCallback(async (name, enabled) => {
    await api.toggleAutomation({automationName: name});
 
    setAutomations((prev) =>
      prev.map((automation) =>
        automation.name === name
          ? { ...automation, enabled}
          : automation
      )
    );
  }, []);

  const handleDeleteAutomation = useCallback(async (name) => {
    await api.deleteAutomation({automationName: name});

    setAutomations((prevAutomations) =>
      prevAutomations.filter((automation) => automation.name !== name)
    );
  }, []);


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
          console.log(err);
        }
    }
    checkUserAuth();
  }, [navigate]);

  // Get all the automations
  const setup = async () => {
    try {
      const res = await api.getAllAutomations();
      setAutomations(res.data.data);
    } catch (err) {
      console.log("Something went wrong while fetching automations!");
    }
  }
  

  return (
    <AutomationsContainer>
    {automations.map(({ name, alias, enabled }) => (
      <AutomationWrapper key={name}>
        <div onClick={() => handleAutomationClick(name)}>
          <AutomationAlias>{alias}</AutomationAlias>
          <AutomationName>{name}</AutomationName>
        </div>
        <ButtonBox>
          <DeleteButton onClick={() => handleDeleteAutomation(name)}>x</DeleteButton>
          <ToggleBox enabled={enabled || false} onClick={() => handleToggleAutomation(name, !enabled)} />
        </ButtonBox>
      </AutomationWrapper>
    ))}
    <AutomationWrapper style={{background: "#22b542"}} onClick={() => handleNewAutomationClick()}>
      <AutomationAlias>+ New automation</AutomationAlias>
    </AutomationWrapper>
    </AutomationsContainer>
  );
};

export default Automations;
