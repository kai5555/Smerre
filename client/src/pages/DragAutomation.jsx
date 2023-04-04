import { useCallback, useState } from 'react'
import Container from '../components/Container.jsx'
import CustomDragLayer from '../components/CustomDragLayer.jsx'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DragAutomation = () => {
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div>
          <Container />
          <CustomDragLayer />
        </div>
      </DndProvider>
    </>
  )
}

export default DragAutomation;