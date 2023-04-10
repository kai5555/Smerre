import { memo, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import componentMap from './Boxes'
import { ItemTypes } from '../scripts'

function getStyles(left, top, isDragging) {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
    zIndex: 1,
  }
}

const DraggableBox = memo(function DraggableBox(props) {
  const { id, left, top, wrong, type, content, onClick, onDoubleClick } = props;

  const Component = componentMap[type+"Box"];
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top, type, content, wrong },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top, type, content, wrong],
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <div
      id={id}
      ref={drag}
      style={getStyles(left, top, isDragging)}
      role="DraggableBox"
      onClick ={onClick}
      onDoubleClick ={onDoubleClick}
    >
      <Component wrong={wrong} content={content}/>
    </div>
  );
});


export default DraggableBox;