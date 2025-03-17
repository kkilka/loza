import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect, useRef } from 'react'
import styles from './styles/Task.module.css'

function Task({ task, isDeletionPlaceholder, isRemoving }) {
  const [canceling, setCanceling] = useState(false)
  const prevDeletionRef = useRef(isDeletionPlaceholder)
  const wasInDeleteZone = useRef(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    }
  })

  useEffect(() => {
    if (isDeletionPlaceholder) {
      wasInDeleteZone.current = true
    }
    
    if (wasInDeleteZone.current && !isDeletionPlaceholder && !isRemoving) {
      setCanceling(true)
      const timer = setTimeout(() => {
        setCanceling(false)
        wasInDeleteZone.current = false
      }, 200)
      return () => clearTimeout(timer)
    }

    if (isRemoving) {
      wasInDeleteZone.current = false
      setCanceling(false)
    }
  }, [isDeletionPlaceholder, isRemoving])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const className = `
    ${styles.taskCard} 
    ${isDragging ? styles.dragging : ''} 
    ${isRemoving ? styles.removing : ''}
    ${isDeletionPlaceholder ? styles.deletionPlaceholder : ''}
    ${!isRemoving && canceling ? styles.cancelingRemoval : ''}
  `.trim()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={className}
    >
      <h3 className={styles.taskTitle}>{task.title}</h3>
      <p className={styles.taskDescription}>{task.description}</p>
    </div>
  )
}

export default Task
