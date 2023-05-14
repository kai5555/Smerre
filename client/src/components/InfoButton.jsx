import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function InfoButton({ message }) {
  return (
    <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{message}</Tooltip>}
    >
      <FontAwesomeIcon icon="fa-solid fa-circle-info" style={{color: "#c2c2c2",}} />
    </OverlayTrigger>
  );
}
  
export default InfoButton;