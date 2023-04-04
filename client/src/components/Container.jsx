import update from 'immutability-helper';
import { useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableBox from './DraggableBox';
import { ItemTypes } from '../scripts';
import { snapToGrid as doSnapToGrid } from '../scripts';
import { EntityBoxModal, IfBoxModal, StartBoxModal } from './BoxesModals'
import Line from './Line.jsx'
import styled, { keyframes } from 'styled-components'
import { connection } from 'mongoose';

const EditBar = styled.div.attrs({
  className: 'form-group',
})`
  margin: 0 0px;
  position: absolute;
  width: 100%;
  bottom: 0;
  transition: opacity 0.5s ease-out;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`

const bounceAnimation = keyframes`
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(10px) rotate(-360deg);
  }
  50% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
`;

const SubmitButton = styled.button.attrs({
  className: 'btn btn-primary',
})`
  position: fixed;
  top: 120px;
  right: 20px;
`

const Arrow = styled.span`
  display: inline-block;
  margin-left: 5px;
  animation: ${bounceAnimation} 5s infinite;
  animation-timing-function: cubic-bezier(0.25, 0.45, 0.45, 0.95);
`;

const PickButton = styled.button.attrs({
  className: 'btn btn-primary',
})`
  display: inline-block;
  margin-left: 5px;
`;


const modalMap = {
  EntityBoxModal,
  IfBoxModal,
  StartBoxModal,
};

const styles = {
  width: '100vw',
  height: '100vh',
  border: '1px solid black',
  position: 'relative',
};

const Container = () => {
  const [boxes, setBoxes] = useState({
    a: { top: 20, left: 80, title: 'Trigger', type:'Start', content: {}},
    b: { top: 20, left: 580, title: 'Condition', type:'Start', content: {}},
    c: { top: 20, left: 1080, title: 'Action', type:'Start', content: {}},
    d: { top: 180, left: 20, title: 'Entity', type:'Entity', content: { entity_id: "sensor.plant_temperature"}},
    e: { top: 100, left: 90, title: 'Als...', type:'If', content: { type: ">=", value: "90"}},
  });
  const [selectedBox, setSelectedBox] = useState(null);
  const [editBarVisible, setEditBarVisible] = useState(false);
  const [lines, setLines] = useState({});
  const [editBarContent, setEditBarContent] = useState(null);

  const getCenterPoint = (left, top, index) => {
    const boxElement = document.getElementById(index);
    const boxRect = boxElement.getBoundingClientRect();
    const centerX = left + (boxRect.width / 2);
    const centerY = top + (boxRect.height / 2) + 10;
    return { left: centerX, top: centerY };
  };  
  
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      );

      setLines(lines => {
        const updatedLines = {};
        Object.entries(lines).forEach(([lineKey, line]) => {
          if (lineKey[0] == id) {
            line = { ...line, start: getCenterPoint(left, top, id) };
          } 
          else if (lineKey[1] == id) {
            line = { ...line, end: getCenterPoint(left, top, id)  };
          }
          const updatedLineKey = lineKey.slice(0, -1) + (parseInt(lineKey.slice(-1)) + 1);
          updatedLines[updatedLineKey] = line;
        });
        return updatedLines;
      });
    },
    [boxes, lines],
  );
  
  const handleBoxClick = (id) => {
    setSelectedBox(id);
  
    // Check if there are two boxes clicked
    if (selectedBox != null && id != selectedBox) {
      
      // Check if the line already exists between these two boxes
      const key1 = selectedBox + id;
      const key2 = id + selectedBox;
      const existingKeys = Object.keys(lines).map(key => key.substring(0, 2));
      if (existingKeys.includes(key1) || existingKeys.includes(key2)) return;

      // You can't drag a line to a starting box, only from
      const endBoxType = boxes[id].type;
      if(endBoxType == "Start") return;
      
      // Create new line between the two clicked boxes
      const startBox = boxes[selectedBox];
      const endBox = boxes[id];
      const newLine = { start: getCenterPoint(startBox.left, startBox.top, selectedBox), end: getCenterPoint(endBox.left, endBox.top, id) };
      
      setLines((prevLines) => {
        const updatedLines = {
          ...prevLines,
          [selectedBox + id + 0] : newLine,
        };
        
        return updatedLines;
      });
    }
  };

  const changedModal = useCallback(
    (id, content) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { content },
          },
        }),
      );
      setEditBarVisible(false);
    },
    [boxes],
  );

  const deleteModal = useCallback(
    (id) => {
      setBoxes((prevBoxes) => {
        const newBoxes = { ...prevBoxes };
        delete newBoxes[id];
        return newBoxes;
      });

      setLines((prevLines) => {
        const newLines = { ...prevLines };
        for(const key of Object.keys(newLines)) {
          if (key[0] === id || key[1] === id) {
            delete newLines[key];
          } 
        };
        return newLines;
      });

      setSelectedBox(null);
      setEditBarVisible(false);
    },
    []
  );
  
  const cancelledModal = useCallback(() => {
    setEditBarVisible(false);
  }, []);

  const handleLineClick = (key) => {
    console.log(key);
  }

  const handleBoxDoubleClick = (id) => {
    const boxType = boxes[id].type;
    const BoxModal = modalMap[boxType + "BoxModal"];
    setEditBarContent(
      <BoxModal 
        key={id} 
        content={boxes[id].content} 
        onOk={(content) => changedModal(id, content)}
        onCancel={() => cancelledModal()}
        onDelete={() => deleteModal(id)}
      />
    );
    setEditBarVisible(true);
  };

  const submitAutomation = () => {

    var automation = {};

    // Set the basic information of the automation
    automation['alias'] = "Nieuwe automatisering TESTER";
    automation['description'] = "";
    automation['mode'] ="single";

    // Set the tree information
    automation['trigger'] = setupTrigger('a');
  }

  function setupTrigger(boxKey){

    // Get all possible triggers in a tree
    const tree = {};
    addNodeToTree(boxKey, tree); 

    //TEST
    setBoxes(prevBoxes => {
      Object.entries(prevBoxes).forEach(([boxKey, box]) => {
        box.wrong = true;
      });

      return prevBoxes;
    });
    
    // Validate tree
    if(!validateTree(tree)) return;
    

    return null;
  }

  function addNodeToTree(node, tree) {
    const connections = getConnections(node);

    if(connections.length == 0){
      tree[node] = [];
      return tree;
    }
    tree[node] = connections.map((childNode) => {
      const childTree = {};
      addNodeToTree(childNode, childTree);
      return childTree;
    });
  }

  function getConnections(fromBox){
    var connections = [];

    Object.entries(lines).forEach(([lineKey, line]) => {
      if(lineKey[0] == fromBox){
        connections.push(lineKey[1])
      }
    });

    return connections;
  }

  function validateTree(tree){
    const stack = [tree];
    while (stack.length > 0) {
      const node = stack.pop();
     
      if (typeof node === "object") {
        for (const child of Object.values(node)) {
          stack.push(child);
        }
      }

      console.log("Node" + node);
      console.log(stack);
    }
  }

  const handleAddBox = useCallback((type, event) => {
    const { clientX, clientY } = event;

    setBoxes(boxes => {
      // Create a new box object with a key of 'a'
      const lastBoxKey = Object.keys(boxes).pop();
      const nextKey = String.fromCharCode(lastBoxKey.charCodeAt(0) + 1);

      const newBox = { top: clientY - 100, left: clientX, title: type, type: type, content: {} };
      return { ...boxes, [nextKey]: newBox };
    });
  }, []);
      
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.BOX,
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);
        //;[left, top] = doSnapToGrid(left, top)

        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox],
  );
  
  return (
    <><div ref={drop} style={styles}>
      {Object.keys(boxes).map((key) => (
        <DraggableBox
          key={key}
          id={key}
          {...boxes[key]}
          onClick={() => handleBoxClick(key)}
          onDoubleClick={() => handleBoxDoubleClick(key)} />
      ))}
      {Object.entries(lines).map(([key, line]) => (
        <Line
          key={key}
          points={[
            { x: line.start.left, y: line.start.top },
            { x: line.end.left, y: line.end.top },
          ]} 
          onClick={() => handleLineClick(key)}
          />
      ))}
    </div>
    <EditBar visible={editBarVisible}>
      {editBarContent}
    </EditBar>
    <EditBar visible={!editBarVisible}>
      <PickButton onClick={(event) => handleAddBox("Entity", event)}>Add Entity</PickButton>
      <PickButton onClick={(event) => handleAddBox("If", event)}>Add If</PickButton>
    </EditBar>

    <SubmitButton onClick={() => submitAutomation()}>
      Klaar
      <Arrow>&#10148;</Arrow>
    </SubmitButton>
    </>
  );
};
 
export default Container;