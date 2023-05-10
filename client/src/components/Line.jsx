import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { PathLine } from 'react-svg-pathline';
import COLORS from '../scripts/colors'

import styled, { css, keyframes } from "styled-components";

const popIn = keyframes`
  from {
    opacity: 0;
  }
  to {  
    opacity: 1;
  }
`;

function getStartColor(wrong) {
  if (wrong === "content") {
    return COLORS.warningColor;
  } else if (wrong === "connection") {
    return COLORS.errorColor;
  } else {
    return COLORS.defaultColor;
  }
}

function getEndColor(wrong){
  if (wrong === "content") {
    return COLORS.warningLightColor;
  } else if (wrong === "connection") {
    return COLORS.errorLightColor;
  } else {
    return COLORS.defaultLightColor;
  }
}

function getCenterPoint(box){
  const boxElement = document.getElementById(box.key);
  if(!boxElement) return {x: 0, y: 0}
  
  const boxRect = boxElement.getBoundingClientRect();
  const centerX = box.box.left + (boxRect.width / 2);
  const centerY = box.box.top + (boxRect.height / 2);
  return { x: centerX, y: centerY };
}

function getWidth(box){
  const boxElement = document.getElementById(box.key);
  if(!boxElement) return 0
  
  return boxElement.offsetWidth;
}

function getHeight(box){
  const boxElement = document.getElementById(box.key);
  if(!boxElement) return 0
  
  return boxElement.offsetHeight;
}

function Line({ boxes, onClick}) {
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

  const gradientId = `gradient${startBox.key}${endBox.key}`;

  return (
    <>
     <PathLine
        points={points}
        stroke="transparent"
        strokeWidth="50"
        fill="none" 
        r={1}
        onClick={onClick}
      />

      <PathLine
        points={points}
        strokeLinecap="round"
        strokeWidth="2"
        stroke={`url(#gradient${gradientId})`} 
        fill="none"
        r={2}
      />
      <defs>
        <linearGradient id={`gradient${gradientId}`} x1={left == -1 ? "0%":"100%"} x2={left == -1 ? "100%":"0%"} y1={above == -1 ? "0%":"100%"} y2={above == -1 ? "100%":"0%"}>
          <stop offset="0%" stopColor={getStartColor(startBox.box.wrong)} />
          <stop offset="100%" stopColor={getEndColor(endBox.box.wrong)} />
        </linearGradient>
      </defs>
      <g transform={`translate(${newArrowPosition.x},${newArrowPosition.y})`}>
        <circle r="10" fill={getEndColor(endBox.box.wrong)} />
      </g>
    </>
  );
}

export default Line;