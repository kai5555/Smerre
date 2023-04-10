import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { PathLine } from 'react-svg-pathline';
import { GradientPath } from "gradient-path";

const defaultColor = '#22b542';
const defaultLightColor = '#cdf7d6';
const wrongContentColor = "#ff9933";
const wrongContentLightColor = "#f5dec6";
const wrongConnectionColor = "#9c2828";
const wrongConnectionLightColor = "#fccccc";

function getStartColor(wrong) {
  if (wrong === "content") {
    return wrongContentColor;
  } else if (wrong === "connection") {
    return wrongConnectionColor;
  } else {
    return defaultColor;
  }
}

function getEndColor(wrong){
  if (wrong === "content") {
    return wrongContentLightColor;
  } else if (wrong === "connection") {
    return wrongConnectionLightColor;
  } else {
    return defaultLightColor;
  }
}

function getCenterPoint(box){
  const boxElement = document.getElementById(box.key);
  if(!boxElement) return {x: 0, y: 0}
  
  const boxRect = boxElement.getBoundingClientRect();
  const centerX = box.box.left + (boxRect.width / 2);
  const centerY = box.box.top + (boxRect.height / 2);
  return { x: centerX, y: centerY };
}; 

function getWidth(box){
  const boxElement = document.getElementById(box.key);
  if(!boxElement) return 0
  
  return boxElement.offsetWidth;
}; 

function getHeight(box){
  const boxElement = document.getElementById(box.key);
  if(!boxElement) return 0
  
  return boxElement.offsetHeight;
}; 

function Line({ boxes, onClick}) {
  const myRef = useRef(null);
  const [arrowPosition, setArrowPosition] = useState({x: 0, y:0});
  const [arrowColor, setArrowColor] = useState(defaultColor);

  // Setup points
  const startBox = boxes[0];
  const endBox = boxes[1];

  const startPoint = getCenterPoint(startBox);
  const endPoint = getCenterPoint(endBox);
  const points = [startPoint, endPoint]
    
  // Make curves automaticly and add arrows
  const left = (startPoint.x - endPoint.x) <= 0 ? -1 : 1; // - if start left
  const above = (startPoint.y - endPoint.y) <= 0 ? -1 : 1; // - if start above
  const startWidth = getWidth(startBox);
  const startHeight = getHeight(startBox);
  const endWidth  = getWidth(endBox);
  const endHeight = getHeight(endBox);
  const yDiff = Math.abs(startPoint.y - above * startHeight/2 - (endPoint.y + above * endHeight/2));
  const xDiff = Math.abs(startPoint.x - left * startWidth/2 - (endPoint.x + left * endWidth/2));
  var newArrowPosition = {x: 0, y:0};

  if(yDiff < 30){
    points.splice(1, 0, {x:startPoint.x, y:endPoint.y});  
    newArrowPosition = {x: endPoint.x + left * endWidth/2, y: endPoint.y};
  }
  else if(yDiff < 75){
    points.splice(1, 0, {x:endPoint.x, y:startPoint.y});
    newArrowPosition = {x: endPoint.x, y: endPoint.y + above * endHeight/2};
  }
  else{
    const differenceX = Math.abs(points[1].x - points[0].x);
    if(differenceX > 5){
      const middleY = points[0].y + ((points[1].y - points[0].y) / 2); 
      points.splice(1, 0, {x: points[0].x, y: middleY});
      points.splice(2, 0, {x: points[2].x, y: middleY});
    }
    newArrowPosition = {x: endPoint.x, y: endPoint.y + above * endHeight/2};
  }
  points[points.length - 1] = newArrowPosition;
  
  
  useEffect(() => {
    const svgElem = myRef.current;
    const path = svgElem.getElementsByTagName("path")[0];
    const gp = new GradientPath({
      path: path,
      segments: 50,
      samples: 3,
      precision: 2 // Optional
    });

    const myColors = [{ color: getStartColor(startBox.box.wrong), pos: 0 }, { color: getEndColor(endBox.box.wrong), pos: 1 }];
    gp.render({
      type: "path",
      fill: myColors,
      width: 2,
      stroke: "transparent",
      strokeWidth: 25

    });

    // Bad paths fix
    const elementPath = svgElem.getElementsByClassName("element-path")[0];
    elementPath.firstChild.remove();
    elementPath.lastChild.remove();

    // Add onClick methods
    const paths = elementPath.querySelectorAll('path');
    paths.forEach(path => {
      path.addEventListener('click', (event) => {
        event.stopPropagation();
        console.log(`Clicked`);

        onClick();
      });
    });

    setArrowPosition(newArrowPosition);
    setArrowColor(getEndColor(endBox.box.wrong));

    // Cleanup function to remove event listeners when component unmounts
    return () => {
      paths.forEach(path => {
        path.removeEventListener('click', () => {});
      });
    };

  }, [boxes]);


  return (
    <svg ref={myRef} style={{position: "absolute", width:"100%", height:"100%"}}>
      <PathLine
        points={points}
        stroke="grey"
        strokeWidth="2"
        fill="none" 
        r={2}
      />
      <g transform={`translate(${arrowPosition.x},${arrowPosition.y})`}>
        <circle r="10" fill={arrowColor} />
      </g>
    </svg>
  );
}

export default Line;