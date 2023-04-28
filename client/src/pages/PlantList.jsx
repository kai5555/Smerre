import { useCallback, useLayoutEffect, useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate} from 'react-router-dom';

const PlantContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
`;

const PlantWrapper = styled.div`
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

const PlantName = styled.div`
  font-size: 12px;
`;

const PlantAlias = styled.div`
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

const PlantList = () => {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);

  const handlePlantClick = useCallback((name) => {
    window.location.href = `/plant/${name}`;
  }, []);

  const handleNewPlantClick = useCallback(() => {
    window.location.href = `/plant/add`;
  }, []);


  const handleDeletePlant = useCallback(async (name) => {
    await api.deletePlant({name: name});

    setPlants((prevPlants) =>
      prevPlants.filter((plant) => plant.name !== name)
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

  // Get all the plants
  const setup = async () => {
    try {
      const res = await api.getAllPlants();
      console.log(res);
      setPlants(res.data.data);
    } catch (err) {
      console.log("Something went wrong while fetching plants!");
    }
  }
  

  return (
    <PlantContainer>
      {plants.map(({ name }) => (
        <PlantWrapper key={name}>
          <div onClick={() => handlePlantClick(name)}>
            <PlantAlias>{name}</PlantAlias>
            <PlantName>{name}</PlantName>
          </div>
          <ButtonBox>
            <DeleteButton onClick={() => handleDeletePlant(name)}>x</DeleteButton>
          </ButtonBox>
        </PlantWrapper>
      ))}
      <PlantWrapper style={{background: "#22b542"}} onClick={() => handleNewPlantClick()}>
        <PlantAlias>+ New Plant</PlantAlias>
      </PlantWrapper>
    </PlantContainer>
  );
};

export default PlantList;
