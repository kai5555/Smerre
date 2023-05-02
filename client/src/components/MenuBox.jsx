import { memo, useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import componentMap from './Boxes'
import { ItemTypes } from '../scripts'
import COLORS from '../scripts/colors'
import styled, { keyframes } from 'styled-components';

const styles = {
  padding: '0.5rem 1rem',
  cursor: 'move',
  borderRadius: '5px',
  boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
}

const flyIn = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100);
  }
`;
const Box = styled.div`
  display: inline-block;
  animation: ${flyIn} 0.5s ease-in-out;
`;


function getStyles(left, top, isDragging, rotate, isHovered) {
  const hoveringOffset = isHovered ? -15 : 0;
  const draggingOffset = isDragging ? 300 : 0;
  const transform = `translate3d(${left}px, ${top + hoveringOffset + draggingOffset}px, 0) rotate(${rotate})`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
    zIndex: 1,
    width: "120px",
    transition: "transform 0.2s ease-in-out",
  }
}

const MenuBox = memo(function MenuBox(props) {
  const { id, left, top, type, yellow, rotate } = props;
  const backgroundColor = yellow ? 'yellow' : 'white'

  const [isHovered, setIsHovered] = useState(false);
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.MENUBOX,
      item: { id, left, top, type, rotate,itemType: ItemTypes.MENUBOX },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top, type, rotate],
  );
  
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <Box 
      id={id}
      ref={drag}
      style={getStyles(left, top, isDragging, rotate, isHovered)}
      role="DraggableBox"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div  
        style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
        role={preview ? 'BoxPreview' : 'Box'}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:COLORS.defaultColor }}></div>
        <div style={{ position: 'relative' }}>
          {type  !== "" ? (
            <p style={{fontWeight: 'bold', color: 'white'}}>{type}</p>
          ) : (
            <p style={{fontWeight: 'bold', color: COLORS.defaultColor}}>...</p>
          )}
        </div>
      </div>
    </Box>
  );
});


export default MenuBox;