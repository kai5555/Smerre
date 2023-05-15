import update from 'immutability-helper';
import React, { useCallback, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import DraggableBox from './DraggableBox';
import MenuBox from './MenuBox';
import { COLORS, ItemTypes } from '../scripts';
import modalMap from './BoxesModals'
import GridLines from 'react-gridlines';
import Line from './Line.jsx'
import styled, { keyframes } from 'styled-components'
import api from '../api' 

const EditBar = styled.div.attrs({
  className: 'form-group',
})`
  margin: 0 0px;
  position: fixed;
  width: 100%;
  bottom: 0;
  transition: opacity 0.5s ease-out;
  background: white;
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

const StepButton = styled.button.attrs({
  className: 'btn btn-primary',
})`
  margin-left: 10px;
`;

const StepButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  top: 100px;
  right: 20px;
`;

const MenuBoxContainer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);  
`;


const Arrow = styled.span`
  display: inline-block;
  margin-left: 5px;
  animation: ${bounceAnimation} 5s infinite;
  animation-timing-function: cubic-bezier(0.25, 0.45, 0.45, 0.95);
`;


const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 100px;
`

const Info = styled.p`
  text-align: center;
`

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: 3px 3px 5px 5px rgba(0,0,0,0.3);
  max-width: 500px;
  margin: 0 auto;
`;

const DragContainer = styled.div`
  background-color: red;

`;

const Grid = styled(GridLines)`
  height: 100vh;
  width: 100vw;
  background-color: white;
`;

const TutorialBox = styled.div`
  position: absolute;
  z-index: -1;
`;

const Container = (props) => {
  const {automation, onSubmitCall, tutorialStep} = props;

  const [boxes, setBoxes] = useState({
    A: { top: 20, left: window.innerWidth / 2 - 25, type:'Start', content: { title: "If"}, errors: [], step: 0 },
    B: { top: 20, left: window.innerWidth / 2 - 25, type:'Start', content: { title: "Then"}, errors: [], step: 1 },
  });

  const [selectedBox, setSelectedBox] = useState(null);
  const [editBarVisible, setEditBarVisible] = useState(false);
  const [lines, setLines] = useState({});
  const [editBarContent, setEditBarContent] = useState(null);
  const [viewStep, setViewStep] = useState(0);
  const [entities, setEntities] = useState([]);

  
  // Load a automation when editing
  useEffect(() => {
    if(automation){
      setLines(automation.lines);

      const myComponent = document.getElementById('A');
      myComponent.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setBoxes(automation.boxes);
    }
  }, [automation]);


  // Get all the sensors and actors
  useEffect(() => {
    async function getAllEntities() {
        try {
          var newEntities = [];
          var res = await api.getAllSensors();
          newEntities = res.data.data;
  
          res = await api.getAllActors();
          newEntities = newEntities.concat(res.data.data); 

          setEntities(newEntities);

        } catch (err) {

        }
    }
    getAllEntities();
  }, [])  

  useEffect(() => {
    setLines(prevLines => {
      const updatedLines = {};
      Object.entries(prevLines).forEach(([lineKey, line]) => {
        const updatedLineKey = lineKey.slice(0, -1) + (parseInt(lineKey.slice(-1)) + 1);
        updatedLines[updatedLineKey] = line;
      });
      return updatedLines;
    });
  }, [boxes, viewStep])

  // Tutorial logic
  const tutorialSteps = [
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1}});
      document.querySelector("#nextBtn").disabled = true;
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1}});
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}})
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}})
      if(document.querySelector("#C")){
        handleBoxDoubleClick("C");
      }
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}});
      activateNextButtonTutorial();
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}})
      document.querySelector("#nextBtn").click();
      document.querySelector("#nextBtn").disabled = true;
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}})
      if(document.querySelector("#C")){
        handleBoxDoubleClick("C");
      }
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}})
      activateNextButtonTutorial();
    },
    function(){
      setBoxes({"A":{"top":20,"left":935,"type":"Start","content":{"title":"If"},"errors":[],"step":0},"B":{"top":20,"left":935,"type":"Start","content":{"title":"Then"},"errors":[],"step":1},"C":{"top":141,"left":914,"title":"Entity","type":"Entity","content":{},"errors":[],"step":0}})
      setLines({"AC0":{"step":0}})
      document.querySelector("#nextBtn").disabled = true;
      setViewStep(1);
    },  
  ]
  useEffect(() => {
    if(tutorialSteps[tutorialStep-1]){
      tutorialSteps[tutorialStep-1]();
    }
  }, [tutorialStep]);

  const activateNextButtonTutorial = useCallback(() => {
    setEditBarVisible(false);
    document.querySelector("#nextBtn").disabled = false;
  }, []);
  

  
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        update(boxes, {
          [id]: {
            $merge: { left, top },
          },
        }),
      );
    },
    [boxes],
  );
  
  const handleBoxClick = (id) => {
    setSelectedBox(id);
  
    // Check if there are two boxes clicked
    if (selectedBox != null && id !== selectedBox) {
      
      // Check if the line already exists between these two boxes
      const key1 = selectedBox + id;
      const key2 = id + selectedBox;
      const existingKeys = Object.keys(lines).map(key => key.substring(0, 2));
      if (existingKeys.includes(key1) || existingKeys.includes(key2)) return;

      // You can't drag a line to a starting box, only from
      const endBoxType = boxes[id].type;
      if(endBoxType === "Start") return;
      
      // Create new line between the two clicked boxes
      const newLine = { step: viewStep};
      
      setLines((prevLines) => {
        const updatedLines = {
          ...prevLines,
          [selectedBox + id + 0] : newLine,
        };
        
        return updatedLines;
      });

      setSelectedBox(null);
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

  const handleBoxDoubleClick = (id) => {
    const boxType = boxes[id].type;
    const BoxModal = modalMap[boxType + "BoxModal"];

    // Get the parent data if available
    const connectionData = getParentConnectionData(id);

    setEditBarContent(
      <BoxModal 
        key={id} 
        content={boxes[id].content} 
        errors={boxes[id].errors} 
        onOk={(content) => changedModal(id, content)}
        onCancel={() => cancelledModal()}
        onDelete={() => deleteModal(id)}
        entities={[...entities]}
        connectionData={connectionData}
      />
    );
    setEditBarVisible(true);
  };

  const getParentConnectionData = (childId) => {
    // Get the line where this is second, meaning the line to the parent (Can only have one parent)
    let parentLine = Object.keys(lines).filter((id) => id.charAt(1) == childId);
    if(!parentLine[0]) return [];
    let parentId = parentLine[0].charAt(0);

    const childBox = boxes[childId];
    const parentBox = boxes[parentId];

    if(parentBox.type == "Entity" && childBox.type == "AdvancedAction"){
      if(!parentBox.content.entity_id) return []; 

      const service = entities.find(obj => obj.entity_id === parentBox.content.entity_id);
      if(service) return service.services;
    }

    return [];
  }

  const submitAutomation = async () => {
    
    const processNode = [{
      "Start": function(content, cond_obj){
        return cond_obj;
      },
      "Entity": function(content, cond_obj){
        // Add the trigger to triggers if not already in array
        const exists = trigger.some(obj => obj.entity_id === content.entity_id);
        if(!exists){
          trigger.push({
            platform: "state",
            entity_id: content.entity_id
          });
        }

        // Add the condition
        cond_obj.push({
          entity_id: content.entity_id,
        });

        return cond_obj[cond_obj.length - 1];
      },
      "CheckValue": function(content, cond_obj){
        cond_obj.condition = "numeric_state";

        // Add condition value
        if(content.type === ">"){
          cond_obj.above = content.value;
        }
        else if(content.type === "<"){
          cond_obj.below = content.value;
        }

        return cond_obj;
      },
      "CheckStatus": function(content, cond_obj){
        cond_obj.condition = "state";
        cond_obj.state = content.status == "active" ? "Aan" : "Uit";

        return cond_obj;
      },
      "And": function(content, cond_obj){
        // Add and condition 
        cond_obj.push({
          condition: "and",
          conditions: []
        });

        return cond_obj[cond_obj.length - 1].conditions;
      },
      "Or": function(content, cond_obj){
        // Add or condition 
        cond_obj.push({
          condition: "or",
          conditions: []
        });

        return cond_obj[cond_obj.length - 1].conditions;
      },
      "Time": function(content, cond_obj){
          // Add the trigger to triggers
          trigger.push({
            platform: "time_pattern",
            ...(content.seconds !== "" && { seconds: content.seconds}),
            ...(content.minutes !== "" && { minutes: content.minutes}),
            ...(content.hours !== "" && { hours: content.hours}),
            ...(content.repeatType !== "" && { [content.repeatType]: `/${content.repeatValue}` }),
          });
          
          return cond_obj;
      },
      "Weather": function(content, cond_obj){

        // Add or condition 
        if(content.type == 0){
          cond_obj.push({
            condition: "state",
            entity_id: "weather.openweathermap",
            state: content.status,
          });
        }
        else if(content.type == 1){
          var condition = {
            condition: "numeric_state",
            entity_id: "weather.openweathermap",
            attribute: content.valueType,
          };

          if(content.condition === ">"){
            condition.above = content.value;
          }
          else if(content.condition === "<"){
            condition.below = content.value;
          }
          cond_obj.push(condition);
        }

        // Add the trigger to triggers
        trigger.push({
          platform: "state",
          entity_id: "weather.openweathermap"
        });
        return cond_obj;
      },
    },
    {
      "Start": function(content, action_obj){
        const parallel = [];
        action_obj.push({parallel: parallel});
        return parallel;
      },
      "Entity": function(content, action_obj){
        // Add the action
        const sequence = [];
        action_obj.push({ sequence: sequence});
        sequence.push({
          service: "",
          target: {
            entity_id: content.entity_id
          }
        });

        return sequence;
      },
      "BasicAction": function(content, action_obj){
        const action = action_obj[action_obj.length - 1];
        action.service = "switch." + content.type;

        return action_obj;
      },
      "AdvancedAction": function(content, action_obj){
        const action = action_obj[action_obj.length - 1];
        action.service = content.service;
        action.data_template = content.data;
        delete action.target;

        return action_obj;
      },
      "Delay": function(content, action_obj){
        let times = content.time.split(":");
        let delay = {
          hours: times[0],
          minutes: times[1],
          seconds: times[2],
          milliseconds: times[3],
        }
        action_obj.push({
          delay: delay,
        });

        const parallel = [];
        action_obj.push({parallel: parallel});
        return parallel;
      },
    }]

    let automation = {};
    let trigger = [];
    let condition = [];
    let action = [];

    // Create a graph 
    let graph = createGraph();

    // Set the basic information of the automation
    automation['description'] = "";
    automation['mode'] ="single";

    // Set the automation for condition and trigger
    let startNode = Object.keys(boxes)[0];
    traverseGraph(startNode, condition, 0);
    automation['trigger'] = trigger;
    automation['condition'] = condition;

    // Set the automation for action
    startNode = Object.keys(boxes)[1];
    traverseGraph(startNode, action, 1);
    automation['action'] = action;

    // Finally sent the created automation and current structure to the parent component
    console.log(automation);  
    console.log(boxes);
    console.log(lines);
    //onSubmitCall(automation, lines, boxes);

    function traverseGraph(key, obj, step){
      let box = boxes[key];
      let next = processNode[step][box.type](box.content, obj);
      
      let node = graph[key];
      node.children.forEach(child => {
        traverseGraph(child, next, step);
      });
    }
  }

  function createGraph(){
    // Setup the graph
    var graph = {};
    for(let box in boxes){
      graph[box] = {parent: null, children: []}
    }
    for(let line in lines){
      let u = line[0];
      let v = line[1];
      graph[u].children.push(v);
      graph[v].parent = u;
    }

    return graph;
  }

  function goNextStep(){
    if(!validateCurrentGraph()) return;

    setSelectedBox(null);
    setViewStep((prevCount) => prevCount + 1)
  }

  function goPreviousStep(){
    setSelectedBox(null);
    setViewStep((prevCount) => prevCount - 1)
  }

  const handleAddBox = useCallback((type, left, top) => {
    if(type == "") return;
    setBoxes(boxes => {
      // Create a new box object with a key of 'a'
      const lastBoxKey = Object.keys(boxes).pop();
      const nextKey = String.fromCharCode(lastBoxKey.charCodeAt(0) + 1);

      const newBox = { top: top, left: left, title: type, type: type, content: {}, errors: [], step: viewStep };
      return { ...boxes, [nextKey]: newBox };
    }); 
  }, [viewStep]);

  const handleLineClick = (id) => {
    const BoxModal = modalMap["LineModal"];
    setEditBarContent(
      <BoxModal 
        key={id} 
        content={{}} 
        errors={[]} 
        onOk={() => {}}
        onCancel={() => cancelledModal()}
        onDelete={() => deleteLine(id)}
      />
    );
    setEditBarVisible(true);
  };
  
  const deleteLine = useCallback(
    (id) => {
      setLines((prevLines) => {
        const newLines = { ...prevLines };
        delete newLines[id];
        return newLines;
      });

      setEditBarVisible(false);
    },
    []
  );
      
  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.MENUBOX, ItemTypes.BOX],
      drop(item, monitor) {

        const delta = monitor.getDifferenceFromInitialOffset();
        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);
        //;[left, top] = doSnapToGrid(left, top)

        if (item?.itemType === ItemTypes.MENUBOX) handleAddBox(item.type, left + window.innerWidth/2, top + window.innerHeight - 120)
        else moveBox(item.id, left, top);
        
        return undefined;
      },
    }),
    [moveBox],
  );


  const heightOffset = -50;
  const widthSpacing = 60;
  document.body.style.overflow='hidden'; // 
  return (
    <>
      {viewStep !== 2 && (
        <>
          <DragContainer ref={drop} data-tut="container">
            {Object.keys(boxes)
              .filter((key) => boxes[key].step === viewStep)
              .map((key) => (
                <DraggableBox
                  key={key}
                  id={key}
                  onClick={() => handleBoxClick(key)}
                  onDoubleClick={() => handleBoxDoubleClick(key)}
                  {...boxes[key]} 
                />
              ))}
            <svg id="lineContainer" style={{position: "absolute", width:"100%", height:"100%"}}>
              {Object.entries(lines)
                .filter(([key, line]) => line.step === viewStep)
                .map(([key, line]) => (
                  <Line
                    key={key}
                    boxes={[
                      {key: key.charAt(0), box:boxes[key.charAt(0)]},
                      {key: key.charAt(1), box:boxes[key.charAt(1)]},
                    ]} 
                    onClick={() => handleLineClick(key)}
                    {...lines[key]}
                  />
                ))}
            </svg>
            <Grid className="grid-area" cellWidth={12 } strokeWidth={1} lineColor='#f2f0f0'></Grid>

            {viewStep === 0 &&(
              <>
                <MenuBoxContainer>
                  <MenuBox type="" rotate="-10deg" left={-210} top={heightOffset}></MenuBox>
                  <MenuBox type="" rotate="10deg" left={200} top={heightOffset}></MenuBox>

                  <MenuBox type="Entity" rotate="60deg" left={-180} top={heightOffset}></MenuBox>
                  <MenuBox type="And" rotate="60deg" left={-120} top={heightOffset}></MenuBox>
                  <MenuBox type="Or" rotate="60deg" left={-60} top={heightOffset}></MenuBox>
                  <MenuBox type="Time" rotate="60deg" left={0} top={heightOffset}></MenuBox>
                  <MenuBox type="CheckValue" rotate="60deg" left={60} top={heightOffset}></MenuBox>
                  <MenuBox type="CheckStatus" rotate="60deg" left={120} top={heightOffset}></MenuBox>
                  <MenuBox type="Weather" rotate="60deg" left={180} top={heightOffset}></MenuBox>

                  <TutorialBox data-tut="picks" style={{width: '530px', height:'500px', left:"-210px", top:"-100px"}}></TutorialBox>
                </MenuBoxContainer>

                <StepButtonsContainer data-tut="steps" >
                  <StepButton id="nextBtn" onClick={() => goNextStep()}>
                    Next 
                  </StepButton>
                </StepButtonsContainer>
              </>
            )}
            {viewStep === 1 &&(
              <> 
                <MenuBoxContainer>                  
                  <MenuBox type="" rotate="-10deg" left={-100} top={heightOffset}></MenuBox>
                  <MenuBox type="" rotate="10deg" left={100} top={heightOffset}></MenuBox>

                  <MenuBox type="Entity" rotate="60deg" left={-90} top={heightOffset}></MenuBox>
                  <MenuBox type="BasicAction" rotate="60deg" left={-30} top={heightOffset}></MenuBox>
                  <MenuBox type="AdvancedAction" rotate="60deg" left={30} top={heightOffset}></MenuBox>
                  <MenuBox type="Delay" rotate="60deg" left={90} top={heightOffset}></MenuBox>
                </MenuBoxContainer>

                <StepButtonsContainer>
                  <StepButton id="prevBtn" onClick={() => goPreviousStep()}>
                    Previous 
                  </StepButton>
                  <StepButton id="nextBtn" onClick={() => goNextStep()}>
                    Next 
                  </StepButton>
                </StepButtonsContainer>
              </>
            )}
          </DragContainer>
        </>
      )}

      {viewStep !== 2 &&(
        <>
          <EditBar data-tut="editbar" visible={editBarVisible} style={{zIndex: editBarVisible ? 2 : -1}}>
            {editBarContent}
          </EditBar>
        </>
      )}

      {viewStep === 2 && (
        <>
          <Title>Ready to upload automation</Title>
          <ContentBox>
            <Info>Your automation has been verified, to upload it to homeassitant and mongodb press the button below</Info>
            <Button id="submitBtn" onClick={() => submitAutomation()}>
              Done
              <Arrow>&#10148;</Arrow>
            </Button>
            
            <Button id="prevBtn" onClick={() => goPreviousStep()}>
              Go Back 
            </Button>
          </ContentBox>
        </>
      )}

    </>
  );

  function validateCurrentGraph(){
    
    const regexPresets = {
      everything: /.*/,
      everything_or_none: /^.*$/,
      none: /^$/,
      everything_except: function(exceptions) {
        const regex = new RegExp(`^(?!(${exceptions.join("|")})).*$`);
        return regex;
      },
      only: function(allowed) {
        const regex = new RegExp(`^(${allowed.join("|")})$`);
        return regex;
      },
      or: (expressions) => new RegExp(`(${expressions.join("|")})`),
      and: (expressions) => new RegExp(`^${expressions.join("")}$`)
    };

    function isKeyValid(obj, key) {
      return obj[key]?.trim() ?? false;
    }
 
    const connectionValidations = [{
      "Start": {
        "min_children": 1,
        "max_children": 1,
        "possible_parents": regexPresets.none,
        "parent_warning": "'Start' can't have any parents",
        "child_warning": "'Start' can have only one child",
      },
      "Entity": {
        "min_children": 1,
        "max_children": 2,
        "possible_parents": regexPresets.only(["Start", "And", "Or"]),
        "parent_warning": "'Entity' can only have the 'If', 'And', 'Or' as parent",
        "child_warning": "'Entity' can have 1 to 2 children",
      },
      "CheckValue": {
        "min_children": 0,
        "max_children": 0,
        "possible_parents": regexPresets.only(["Entity"]),
        "parent_warning": "'Value' can only have the 'Entity' as parent",
        "child_warning": "'Value' can't have any children",
      },
      "CheckStatus": {
        "min_children": 0,
        "max_children": 0,
        "possible_parents": regexPresets.only(["Entity"]),
        "parent_warning": "'Status' can only have the 'Entity' as parent",
        "child_warning": "'Status' can't have any children",
      },
      "And": {
        "min_children": 2,
        "max_children": Infinity,
        "possible_parents": regexPresets.only(["Start", "And", "Or"]),
        "parent_warning": "'And' can only have the 'If', 'And', 'Or' as parents",
        "child_warning": "'And' must have more then 2 children",
      },
      "Or": {
        "min_children": 2,
        "max_children": Infinity,
        "possible_parents": regexPresets.only(["Start", "And", "Or"]),
        "parent_warning": "'Or' can only have the 'If', 'And', 'Or' as parents",
        "child_warning": "'Or' must have more then 2 children",
      },
      "Time": {
        "min_children": 0,
        "max_children": 0,
        "possible_parents": regexPresets.only(["Start", "And", "Or"]),
        "parent_warning": "'Time' can only have the 'If', 'And', 'Or' as parents",
        "child_warning": "'Time' can't have any children",
      },
      "Weather": {
        "min_children": 0,
        "max_children": 0,
        "possible_parents": regexPresets.only(["Start", "And", "Or"]),
        "parent_warning": "'Weather' can only have the 'If', 'And', 'Or' as parents",
        "child_warning": "'Weather' can't have any children",
      },
    },
    {
      "Start": {
        "min_children": 1,
        "max_children": Infinity,
        "possible_parents": regexPresets.none,
        "parent_warning": "'Start' can't have any parents",
        "child_warning": "'Start' must have more than one child",
      },
      "Entity": {
        "min_children": 1,
        "max_children": 1,
        "possible_parents": regexPresets.only(["Start","Delay"]),
        "parent_warning": "'Entity' can only have the 'Then' and 'Delay' as parent",
        "child_warning": "'Entity' can only have 1 child",
      },
      "BasicAction": {
        "min_children": 0,
        "max_children": 1,
        "possible_parents": regexPresets.only(["Entity"]),
        "parent_warning": "'BasicAction' can only have the 'Entity' as parent",
        "child_warning": "'BasicAction' can only have one child",
      },
      "AdvancedAction": {
        "min_children": 0,
        "max_children": 1,
        "possible_parents": regexPresets.only(["Entity"]),
        "parent_warning": "'AdvancedAction' can only have the 'Entity' as parent",
        "child_warning": "'AdvancedAction' can only have one child",
      },
      "Delay": {
        "min_children": 1,
        "max_children": Infinity,
        "possible_parents": regexPresets.only(["BasicAction","AdvancedAction"]),
        "parent_warning": "'Delay' can only have the 'Actions' as parent",
        "child_warning": "'Delay' must have one or more children",
      },
    }]
    
    const contentValidations = [{
      "Start": function validate(key) {
        return 'success';
      },
      "Entity": function validate(key) {
        let box = boxes[key];
        let node = graph[key];
    
        let content = box.content;
        let obj = entities.find(obj => obj.entity_id === content.entity_id);
        if(!obj) return "'Entity' has a entity that can be found"
        
        if(obj.type === "sensor"){
          const values = []

          // Check for only value children and if these values make sense?
          for(let i = 0; i < node.children.length; i++){
            let child = boxes[node.children[i]];
            if(child.type !== "CheckValue") return "'Entity' can only have values as children";

            let childContent = child.content;
            if(values.includes(childContent.type) || values.includes("=") || (values.length > 0 && childContent.type === "=")) return "'Entity' values don't make sense"; // If same type or equals
            values.push(childContent.type);
          }

        }
        else{
          // Check for only status child
          for(let i = 0; i < node.children.length; i++){
            let child = boxes[node.children[i]];
            if(child.type !== "CheckStatus") return "'Entity' can only have status as children";
          }
        }

        return 'success';
      },
      "CheckValue": function validate(key){
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Value' doesn't have any content";
        
        if(!isKeyValid(content, "type")) return "'Value' doesn't have any type";

        if(!isKeyValid(content, "value")) return "'Value' doesn't have any value";

        return 'success';
      },
      "CheckStatus": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Value' doesn't have any content";
        
        if(!isKeyValid(content, "status")) return "'Status' doesn't have any status";

        return 'success';
      },
      "SetValue": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Value' doesn't have any content";
        
        if(!isKeyValid(content, "value")) return "'Value' doesn't have any value";

        return 'success';
      },
      "SetStatus": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Value' doesn't have any content";
        
        if(!isKeyValid(content, "status")) return "'Status' doesn't have any status";

        return 'success';
      },
      "And": function validate(key) {
        return 'success';
      },
      "Or": function validate(key) {
        return 'success';
      },
      "Time": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Time' doesn't have any content";

        if(isKeyValid(content, "repeatType" ) && !isKeyValid(content, "repeatValue")) return "'Time' doesn't have a repeat value";

        return 'success';
      },
      "Weather": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Weather' doesn't have any content";

        if(!isKeyValid(content, "type")) return "'Weather' doesn't have selected type";

        if(content.type === "0"){
          if(!isKeyValid(content, "status" )) return "'Weather' doesn't have a status";
        }
        else if(content.type === "1"  ){
          if(!isKeyValid(content, "value" )) return "'Weather' doesn't have a value";
          if(!isKeyValid(content, "condition" )) return "'Weather' doesn't have a condition";
          if(!isKeyValid(content, "valueType" )) return "'Weather' doesn't have a valueType";
        }

        return 'success';
      },
    },
    {
      "Start": function validate(key) {
        return 'success';
      },
      "Entity": function validate(key) {
        let box = boxes[key];
        let node = graph[key];
    
        let content = box.content;
        let obj = entities.find(obj => obj.entity_id === content.entity_id);
        if(!obj) return "'Entity' has a entity that can be found"
        
        if(obj.type === "sensor"){

          for(let i = 0; i < node.children.length; i++){
            let child = boxes[node.children[i]];
            if(child.type === "BasicAction" || child.type === "AdvancedAction") return "'Entity' can't have any action as child";
          }

        }
        else{

          for(let i = 0; i < node.children.length; i++){
            let child = boxes[node.children[i]];
            if(child.type !== "BasicAction" && child.type !== "AdvancedAction") return "'Entity' must have a action as child";
          }
        }

        return 'success';
      },
      "BasicAction": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'BasicAction' doesn't have any content";
        
        if(!isKeyValid(content, "type")) return "'BasicAction' doesn't have any type";

        let node = graph[key];
        let parent = boxes[node.parent];
        let obj = entities.find(obj => obj.entity_id === parent.content.entity_id);
        if(!obj) return "'BasicAction' has a provided entity that can be found"

        // Check if advanced action is valid
        if(obj.services){
          return "'BasicAction' can only have a advanced action";
        }

        return 'success';
      },
      "AdvancedAction": function validate(key) {
        let box = boxes[key];
        let content = box.content;        
        if(!content) return "'AdvancedAction' doesn't have any content";
        
        if(!isKeyValid(content, "service")) return "'AdvancedAction' doesn't have any service";

        let node = graph[key];
        let parent = boxes[node.parent];
        let obj = entities.find(obj => obj.entity_id === parent.content.entity_id);
        if(!obj) return "'AdvancedAction' has a provided entity that can be found"

        // Check if advanced action is valid
        if(!obj.services){
          return "'Entity' can't have a advanced action, try a basic action instead";
        }

        var service = obj.services.find(s => s.service === content.service);
        if(!service){
          return "'Entity' doesn't have a serivce called " + content.service;
        }
        
        // Check the data
        if(!content.data)return "'Entity' doesn't have any data "
        Object.entries(service.data || {}).forEach(([name, value]) => {
          if(!isKeyValid(content.data, name)){
            return "'Entity' has a empty field for " + name;
          }
        });

        
        return 'success';
      },
      "Delay": function validate(key) {
        let box = boxes[key];
        let content = box.content;
        if(!content) return "'Delay' doesn't have any content";

        if(!isKeyValid(content, "time" )) return "'Delay' doesn't have a time";
        
        var time = content.time;
        if(time.length != 11){
          return "'Delay' isn't of a good format, try hh:mm:ss:ms";
        }

        let times = time.split(":");
        if(times.length != 4){
          return "'Delay' isn't of a good format, try hh:mm:ss:ms";
        }

        return 'success';
      },
      
    }]

    // Setup vars and clear error lists
    let graph = createGraph();
    let updatedBoxes = {...boxes};
    for (let key in updatedBoxes) {
      updatedBoxes[key].errors = [];
    }
    let valid = true;

    // Start initial node of the current step
    dfs(Object.keys(boxes)[viewStep]);

    // Finnally set wrong boxes and lines and errors
    setBoxes(updatedBoxes);
    
    // If not errors have occured return that
    return valid;

    // Do a depth first search on the tree to travese all nodes and check the order and content
    function dfs(key) {
      let box = updatedBoxes[key];

      // Check if content and order are valid and set colors and errors if not
      let nodeValid = validateNode(key);
      if(nodeValid !== "success"){
        box.wrong = "connection";
        updatedBoxes[key].errors.push({message: nodeValid, type: "connection"});
        valid = false;
      }
      else{
        let contentValid = validateContent(key);
        if(contentValid !== "success"){
          box.wrong = "content";
          updatedBoxes[key].errors.push({message: contentValid, type: "content"});
          valid = false;
        }
        else{
          box.wrong = "";
        }
      }
      
      // Loop through rest of graph recursively and mark visited nodes
      graph[key].visited = true; 
      for (let child of graph[key].children) {
        if (!graph[child].visited) {
          dfs(child); 
        }
      }
    }

    // Check if the node order is valid of the given node, check parent type and number of children
    function validateNode(key){
      let box = boxes[key];
      let node = graph[key];

      let type = box.type;
      let validation = connectionValidations[viewStep][type];

      if(!node.parent){
        let children = node.children.length;
        if(validation.min_children > children || children > validation.max_children) return validation.child_warning;
        return 'success';
      };

      let parentType = boxes[node.parent].type; 

      // Validate node children
      let children = node.children.length;
      if(validation.min_children > children || children > validation.max_children) return validation.child_warning;

      // Validate nodes order
      let allowedParentsRegex = validation.possible_parents; 
      let isParentAllowed = allowedParentsRegex.test(parentType); 
      if(!isParentAllowed) return validation.parent_warning;

      return 'success';
    }

    // Check if the content if valid of a given node
    function validateContent(key){
      let box = boxes[key];
      let type = box.type;

      return contentValidations[viewStep][type](key);
    }
  }
};

export default Container;