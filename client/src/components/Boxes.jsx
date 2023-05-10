import { memo } from 'react'
import COLORS from '../scripts/colors'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled, { css, keyframes } from "styled-components";

const popIn = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

//const Box = styled.div``;
const Box = styled.div`
  ${({ role }) =>
    role === "Box" &&
    css`
      display: inline-block;
      animation: ${popIn} 0.25s ease-in-out;
    `}
`;

const styles = {
  padding: '0.5rem 1rem',
  cursor: 'move',
  borderRadius: '5px',
  boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
}

function getBackgroundColor(wrong){
  switch (wrong) {
    case 'connection':
      return COLORS.errorColor;
    case 'content':
      return COLORS.warningColor;
    default:  
      return COLORS.defaultColor;
  }
}


const StartBox = memo(function StartBox(props) {
  const { yellow, preview, content, wrong } = props;

  return (
    <Box
      style={{ ...styles, backgroundColor:getBackgroundColor(wrong) , fontWeight: 'bold' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{color: 'white', margin: '0 0 0 0'}}>{content.title}</p>
    </Box>
  );
});


const EntityBox = memo(function EntityBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong)}}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
           Entity
           <FontAwesomeIcon icon="fa-solid fa-thermometer" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        {content.entity_id && (
          <p>{content.entity_id}</p>
        )}
      </div>
    </Box>
  )
});

const BasicActionBox = memo(function BasicActionBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
          Action
          <FontAwesomeIcon icon="fa-solid fa-play" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
      {content.type && (
        <p>
          {content.type === "turn_off" && "Turn off"}
          {content.type === "turn_on" && "Turn on"}
          {content.type === "toggle" && "Toggle"}
        </p>
      )}
      </div>
    </Box>
  );
});


const AdvancedActionBox = memo(function AdvancedActionBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
      <p style={{fontWeight: 'bold', color: 'white'}}>
          Advanced Action
          <FontAwesomeIcon icon="fa-solid fa-forward" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        {content.service && (
          <p>Call {content.service}</p>
        )}
        { Object.entries(content.data || {}).forEach(([name, value]) => {
          <p>{name}:{value}</p>
        })}
      </div>
    </Box>
  );
});

const CheckValueBox = memo(function CheckValueBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
           Value
           <FontAwesomeIcon icon="fa-solid fa-arrow-up-9-1" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        <p>{content.type} {content.value}</p>
      </div>
    </Box>
  );
});


const CheckStatusBox = memo(function CheckStatusBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
           Status
           <FontAwesomeIcon icon="fa-solid fa-circle-dot" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        {content.status && (
          <p>To {content.status}</p>
        )}
      </div>
    </Box>
  );
});

const AndBox = memo(function AndBox(props) {
  const { yellow, preview, content, wrong } = props;

  return (
    <Box

      style={{ ...styles, fontWeight: 'bold', backgroundColor:getBackgroundColor(wrong)  }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{fontWeight: 'bold', color: 'white'}}>
        And
        <FontAwesomeIcon icon="fa-solid fa-arrows-split-up-and-left" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
      </p>
    </Box>
  );
});

const OrBox = memo(function OrBox(props) {
  const { yellow, preview, content, wrong } = props;

  return (
    <Box
      style={{ ...styles, fontWeight: 'bold', backgroundColor:getBackgroundColor(wrong)  }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{fontWeight: 'bold', color: 'white'}}>
        Or
        <FontAwesomeIcon icon="fa-solid fa-arrows-split-up-and-left" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
      </p>
    </Box>
  );
});


const TimeBox = memo(function TimeBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
          Time
          <FontAwesomeIcon icon="fa-solid fa-clock" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        {(content.seconds || content.minutes|| content.hours) &&(
          <p>Time {content.hours || "--"}:{content.minutes || "--"}:{content.seconds || "--"}</p>
        )}
        {content.repeatType && (
          <p>Repeat every {content.repeatValue} {content.repeatType}</p>
        )}
      </div>
    </Box>
  );
});


const DelayBox = memo(function DelayBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
          Delay
          <FontAwesomeIcon icon="fa-solid fa-hourglass-end" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        {(content.time) &&(
          <p>Time {content.time}</p>
        )}
      </div>
    </Box>
  );
});

const WeatherBox = memo(function WeatherBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <Box  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>
          Weather
          <FontAwesomeIcon icon="fa-solid fa-cloud-sun" size="xs" style={{ color: '#ffffff', margin: "0px -5px 0 5px"}} /> 
        </p>
      </div>
      <div>
        {(content.type) === 0 && (content.status) &&(
          <p>Status {content.status}</p>
        )}
         {(content.type) === 1 && (content.valueType) &&(
          <p>When {content.valueType} {content.condition} {content.value}</p>
        )}
      </div>
    </Box>
  );
});

const componentMap = {
  StartBox,
  EntityBox,
  CheckValueBox,
  CheckStatusBox,
  BasicActionBox,
  AdvancedActionBox,
  AndBox,
  OrBox,
  TimeBox,
  DelayBox,
  WeatherBox,
};

export default componentMap;