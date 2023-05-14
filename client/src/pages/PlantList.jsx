import React, { useCallback, useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import DeletePopup from '../components/DeletePopup';
import { withAuth } from './Authentication';
import LoadingSpinner from "../components/LoadingSpinner";

const PlantList = () => {
    const [plants, setPlants] = useState([]);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [plantToDelete, setPlantToDelete] = useState(null);
    const[loading, setLoading] = useState(true);

    const handlePlantClick = useCallback((name) => {
        window.location.href = `/plant/${name}`;
    }, []);

    const handleNewPlantClick = useCallback(() => {
        window.location.href = `/plant/add`;
    }, []);

    const handleDeletePlant = async (name) => {
        setPlantToDelete(name);
        setShowDeletePopup(true);
    };

    const handleConfirmDelete = async () => {
        await api.deletePlant({ name: plantToDelete });

        setPlants((prevPlants) => prevPlants.filter((plant) => plant.name !== plantToDelete));
        setPlantToDelete(null);
        setShowDeletePopup(false);
    };

    const handleCancelDelete = () => {
        setPlantToDelete(null);
        setShowDeletePopup(false);
    };


    // Get all the plants
    const setup = async () => {
        try {
            const res = await api.getAllPlants();
            console.log(res);
            setPlants(res.data.data);
            setLoading(false);
        } catch (err) {
            console.log('Something went wrong while fetching plants!');
        }
    };

    useEffect( () => {
        setup();
    },[])

    if(loading){
        return (<LoadingSpinner/>)
    }
    return (

        <div className="container my-3">
            <div className="row"><h1 className="h2 mb-4">Plants</h1></div>
            <div className="row">
                {plants.map(({ name, description }) => (
                    <div className="col-md-6 col-lg-4" key={name}>
                        <div className="card shadow-sm mb-4" style={{minHeight: "150px"}}>
                            <div className="card-body">
                                <h5 className="card-title">{name}</h5>
                                <p className="card-text">{description}</p>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center">
                                <button className="btn btn-outline-secondary" onClick={() => handlePlantClick(name)}>
                                    Details
                                </button>
                                {/*<button className="btn btn-danger" onClick={() => handleDeletePlant(name)}>*/}
                                    <i className="bi bi-trash text-danger" style={{fontSize:"1.4rem", cursor:"pointer"}} onClick={() => handleDeletePlant(name)}></i>
                                {/*</button>*/}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow-sm mb-4 d-flex align-items-center text-center" style={{minHeight: "150px", cursor: "pointer"}} onClick={() => handleNewPlantClick()}>
                        <div className="card-body d-flex flex-column justify-content-center">
                            <i className="bi bi-plus-lg pb-2" style={{fontSize: "3rem", color:"MediumSeaGreen" }} ></i>
                        </div>
                    </div>
                </div>
            </div>
            {showDeletePopup && (
                <DeletePopup plantName={plantToDelete} onDelete={handleConfirmDelete} onCancel={handleCancelDelete} />
            )}
        </div>

    );
};

export default withAuth(PlantList);
