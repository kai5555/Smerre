import React, { useRef, useEffect } from 'react';
import { PathLine } from 'react-svg-pathline';
import { GradientPath } from "gradient-path";

const myColors = [
    { color: "#22b542", pos: 0 },
    // { color: "#FBD786", pos: 0.25 },
    // { color: "#F7797D", pos: 0.5 },
    // { color: "#6DD5ED", pos: 0.75 },
    { color: "#ace6b9", pos: 1 }
];  

function Line({ points, onClick }) {
  const myRef = useRef();

  // Add middle points
  const middleY = points[0].y + ((points[1].y - points[0].y) / 2); 
  points.splice(1, 0, {x: points[0].x, y: middleY});
  points.splice(2, 0, {x: points[2].x, y: middleY});

  useEffect(() => {
    const svgElem = myRef.current;
    const path = svgElem.getElementsByTagName("path")[0];
    const gp = new GradientPath({
      path: path,
      segments: 50,
      samples: 3,
      precision: 2 // Optional
    });

    gp.render({
      type: "path",
      fill: myColors,
      width: 2,
      stroke: myColors,
      strokeWidth: 0.5
    });
    
    // not sure why it adds these bad paths but this works to fix
    const elementPath = svgElem.getElementsByClassName("element-path")[0];
    elementPath.firstChild.remove();
    elementPath.lastChild.remove();
    
    svgElem.style.zIndex = -1;
    svgElem.style.pointerEvents = "none";
  }, []);

  return (
    <svg id="test" ref={myRef} style={{position: "absolute", width:"100%", height:"100%", }}>
      <PathLine
        points={points}
        stroke="grey"
        strokeWidth="2"
        fill="none"
        r={2}
      />
    </svg>
  );
}

export default Line;