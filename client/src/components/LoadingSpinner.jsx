import React from 'react';
const LoadingSpinner = () => {
    return (
        <div className="container">
            {/*<div className="d-flex justify-content-center align-items-center">*/}
            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                <div className="spinner-border"  role="status" style={{color:"MediumSeaGreen"}}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>

    );
};

export default LoadingSpinner;