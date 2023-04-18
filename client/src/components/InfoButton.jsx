import { Button,OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components'

const InfoCircle = styled.button.attrs({
  className: 'btn btn-secondary',
})`
  rounded: 10px;
  width: 15px;
  heigth: 10px;
  transform: scale(0.7);
`

function InfoButton({ message }) {
  return (
    <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{message}</Tooltip>}
    >
        <InfoCircle className="p-0">
          i
        </InfoCircle>
    </OverlayTrigger>
  );
}
  
export default InfoButton;