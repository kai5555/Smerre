import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { withAuth } from './Authentication';
import DeletePopup from "../components/DeletePopup";
import LoadingSpinner from "../components/LoadingSpinner";
import io from "socket.io-client";

const Automations = () => {
  let socket = io('http://'+ process.env.REACT_APP_MY_IP + ':5000');

  const [automations, setAutomations] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [automationToDelete, setAutomationToDelete] = useState(null);
  const[loading, setLoading] = useState(true);


  const handleAutomationClick = useCallback((name) => {
    window.location.href = `/automation/${name}/edit`;
  }, []);

  const handleNewAutomationClick = useCallback(() => {
    window.location.href = `/automation/add`;
  }, []);


  const handleDeleteAutomation = (name) => {
    setAutomationToDelete(name);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete =  ()  => {
    socket.emit('deleteAutomations', automationToDelete);

    setAutomationToDelete(null);
    setShowDeletePopup(false);
  };

  const handleCancelDelete = () => {
    setAutomationToDelete(null);
    setShowDeletePopup(false);
  };


  useEffect(()=> {
    socket.emit('initialAutomations');

    socket.on('initialAutomations', (value) => {
      if(value) {
        setAutomations(value);
        setLoading(false);
      }
    });

    socket.on('toggleAutomations', (name, enabled) => {
      setAutomations((prev) =>
          prev.map((automation) =>
              automation.name === name
                  ? { ...automation, enabled}
                  : automation
          )
      );
    });

    socket.on('deleteAutomations', (name) => {
      setAutomations((prevAutomations) =>
          prevAutomations.filter((automation) => automation.name !== name)
      );
    });

  }, []);


  if(loading){
    return (<LoadingSpinner/>);
  }
  return(
      <div className="container my-3 ">
        <div className="row mb-1">
          <div className="col-6"><h1 className="h2 mb-4">Automations</h1></div>
          <div className="col-6 text-end">
            <button type="button" className="btn mt-md-2 pt-1 "
                    style={{color:"white", backgroundColor:"MediumSeaGreen"}}
                    onClick={() => handleNewAutomationClick()}
            >Add automation</button>
          </div>
        </div>
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
                        onClick={() => socket.emit('toggleAutomations', name)}
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
