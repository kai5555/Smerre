import { memo } from 'react';
import styled, { keyframes } from 'styled-components';
import COLORS from '../scripts/colors'

const styles = {
  padding: '0.5rem 1rem',
  cursor: 'move',
  borderRadius: '5px',
  boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
};

const rotateIn = keyframes`
  from {
    transform: rotate(60deg);
  }
  to {
    transform: rotate(7deg);
  }
`;

const RotateBox = styled.div`
  display: inline-block;
  animation: ${rotateIn} 0.2s ease-in-out;
`;

const MenuBoxDragPreview = memo(function BoxDragPreview({ type }) {
  return (
    <RotateBox>
      <div style={{ ...styles, position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 'calc(100% - 2.5rem)',
            backgroundColor: COLORS.defaultColor,
          }}
        ></div>
        <div style={{ position: 'relative' }}>
          <p style={{ fontWeight: 'bold', color: 'white' }}>{type}</p>
        </div>
      </div>
    </RotateBox>
  );
});

export default MenuBoxDragPreview;
