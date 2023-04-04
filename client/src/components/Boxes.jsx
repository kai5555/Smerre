import { memo } from 'react'
import styled from 'styled-components'

const defaultColor = '#22b542';
const wrongColor = "#9c2828";
const styles = {
  padding: '0.5rem 1rem',
  cursor: 'move',
  borderRadius: '5px',
  boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
}


export const EntityBox = memo(function EntityBox(props) {
  const { title, yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor: (wrong ? wrongColor : defaultColor)}}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>{title}</p>
      </div>
      <div>
        <p>{content.entity_id}</p>
      </div>
    </div>

    
  )
});

export const IfBox = memo(function IfBox(props) {
  const { title, yellow, preview, content, wrong } = props;

  const backgroundColor = yellow ? 'yellow' : 'white'
  return (
    <div  
      style={{ ...styles, backgroundColor, position: 'relative', overflow: 'hidden' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 'calc(100% - 2.5rem)', backgroundColor: (wrong ? wrongColor : defaultColor) }}></div>
      <div style={{ position: 'relative' }}>
        <p style={{fontWeight: 'bold', color: 'white'}}>{title}</p>
      </div>
      <div>
        <p>{content.type} {content.value}</p>
      </div>
    </div>
  );
});

export const StartBox = memo(function StartBox({ title, yellow, preview }) {
  return (
    <div
      style={{ ...styles, backgroundColor: defaultColor, fontWeight: 'bold' }}
      role={preview ? 'BoxPreview' : 'Box'}
    >
      <p style={{color: 'white'}}>{title}</p>
    </div>
  );
});
