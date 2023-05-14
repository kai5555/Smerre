import { useDragLayer } from 'react-dnd'
import BoxDragPreview from './BoxDragPreview'
import MenuBoxDragPreview from './MenuBoxDragPreview'
import { ItemTypes } from '../scripts'


const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
}
function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  let { x, y } = currentOffset


  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const CustomDragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }))
  function renderItem() {
    switch (itemType) {
      case ItemTypes.BOX:
        return <BoxDragPreview content={item.content} type={item.type} wrong={item.wrong} />
      case ItemTypes.MENUBOX:
        return <MenuBoxDragPreview type={item.type} />
      default:
        return null
    }
  }
  if (!isDragging) {
    return null
  }
  return (
    <div style={layerStyles}>
      <div
        style={getItemStyles(initialOffset, currentOffset)}
      >
        {renderItem()}
      </div>
    </div>
  )
}

export default CustomDragLayer;
