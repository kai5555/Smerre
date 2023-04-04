import { memo, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { EntityBox, IfBox, StartBox } from './Boxes'
import { ItemTypes } from '../scripts'

const componentMap = {
  EntityBox,
  IfBox,
  StartBox,
};

function getStyles(left, top, isDragging) {
  const transform = `translate3d(${left}px, ${top}px, 0)`
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  }
}

const DraggableBox = memo(function DraggableBox(props) {
  const { id, title, left, top, wrong, type, content, onClick, onDoubleClick } = props;

  const Component = componentMap[type+"Box"];
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.BOX,
      item: { id, left, top, title, type, content },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top, title, type, content],
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
      <Component title={title} wrong={wrong} content={content}/>
    </div>
  );
});


export default DraggableBox;