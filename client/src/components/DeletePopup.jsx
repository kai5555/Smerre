import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeletePopup = ({ plantName, onDelete, onCancel }) => {
    return (
        <Modal show={true} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete {plantName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete {plantName}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    No
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeletePopup;