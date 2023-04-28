import { memo } from 'react'
import styled from 'styled-components'

const defaultColor = '#22b542';
const contentWrongColor = "#ff9933";
const connectionWrongColor = "#9c2828";
const styles = {
  padding: '0.5rem 1rem',
  cursor: 'move',
  borderRadius: '5px',
  boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
}

function getBackgroundColor(wrong){
  switch (wrong) {
    case 'connection':
      return connectionWrongColor;
    case 'content':
      return contentWrongColor;
    default:  
      return defaultColor;
  }
}


const StartBox = memo(function StartBox(props) {
  const { yellow, preview, content, wrong } = props;

  return (
    <div
      style={{ ...styles, backgroundColor:getBackgroundColor(wrong) , fontWeight: 'bold' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{color: 'white', margin: '0 0 0 0'}}>{content.title}</p>
    </div>
  );
});


const EntityBox = memo(function EntityBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong)}}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Entity</p>
      </div>
      <div>
        <p>{content.entity_id}</p>
      </div>
    </div>
  )
});

const BasicActionBox = memo(function BasicActionBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Basic Action</p>
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
    </div>
  );
});


const AdvancedActionBox = memo(function AdvancedActionBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Advanced Action</p>
      </div>
      <div>
        {content.service && (
          <p>Call {content.service}</p>
        )}
        { Object.entries(content.data || {}).forEach(([name, value]) => {
          <p>{name}:{value}</p>
        })}
      </div>
    </div>
  );
});

const CheckValueBox = memo(function CheckValueBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Value</p>
      </div>
      <div>
        <p>{content.type} {content.value}</p>
      </div>
    </div>
  );
});


const CheckStatusBox = memo(function CheckStatusBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Status</p>
      </div>
      <div>
        {content.status && (
          <p>To {content.status}</p>
        )}
      </div>
    </div>
  );
});

const AndBox = memo(function AndBox(props) {
  const { yellow, preview, content, wrong } = props;

  return (
    <div
      style={{ ...styles, backgroundColor: defaultColor, fontWeight: 'bold', backgroundColor:getBackgroundColor(wrong)  }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{color: 'white'}}>And</p>
    </div>
  );
});

const OrBox = memo(function OrBox(props) {
  const { yellow, preview, content, wrong } = props;

  return (
    <div
      style={{ ...styles, backgroundColor: defaultColor, fontWeight: 'bold', backgroundColor:getBackgroundColor(wrong)  }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{color: 'white'}}>Or</p>
    </div>
  );
});


const TimeBox = memo(function TimeBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Time</p>
      </div>
      <div>
        {(content.seconds || content.minutes|| content.hours) &&(
          <p>Time {content.hours || "--"}:{content.minutes || "--"}:{content.seconds || "--"}</p>
        )}
        {content.repeatType && (
          <p>Repeat every {content.repeatValue} {content.repeatType}</p>
        )}
      </div>
    </div>
  );
});


const DelayBox = memo(function DelayBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Delay</p>
      </div>
      <div>
        {(content.time) &&(
          <p>Time {content.time}</p>
        )}
      </div>
    </div>
  );
});

const WeatherBox = memo(function WeatherBox(props) {
  const { yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor:getBackgroundColor(wrong) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>Weather</p>
      </div>
      <div>
        {(content.status) &&(
          <p>Status {content.status}</p>
        )}
      </div>
    </div>
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