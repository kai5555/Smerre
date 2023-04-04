import { memo, useEffect, useState } from 'react'
import { EntityBox, IfBox, StartBox } from './Boxes'

const styles = {
  display: 'inline-block',
  transform: 'rotate(-7deg)',
  WebkitTransform: 'rotate(-7deg)',
}

const BoxDragPreview = memo(function BoxDragPreview({ title, content }) {
  const [tickTock, setTickTock] = useState(false)
  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500)
      return () => clearInterval(interval)
    },
    [tickTock],
  )
  return (
    <div style={styles}>
      <EntityBox title={title} yellow={tickTock} preview content={content} />
    </div>
  )
})

export default BoxDragPreview;