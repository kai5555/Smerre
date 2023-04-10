import { memo, useEffect, useState } from 'react'
import componentMap from './Boxes'

const styles = {
  display: 'inline-block',
  transform: 'rotate(-7deg)',
  WebkitTransform: 'rotate(-7deg)',
}

const BoxDragPreview = memo(function BoxDragPreview({ title, content, type, wrong }) {
  const [tickTock, setTickTock] = useState(false)
  const Component = componentMap[type+"Box"];

  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500)
      return () => clearInterval(interval)
    },
    [tickTock],
  )
  return (
    <div style={styles}>
      <Component title={title} yellow={tickTock} preview content={content} wrong={wrong}/>
    </div>
  )
})

export default BoxDragPreview;