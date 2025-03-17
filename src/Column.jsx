import styles from './styles/Column.module.css'
import Task from './Task'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'

function Column({ column, tasks, id, activeTaskId, pendingRemovals }) {  // добавлены activeTaskId и pendingRemovals
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      type: 'column',
      accepts: ['task'],
      tasks: tasks // Pass tasks to help determine insertion point
    }
  })
  
  const { setNodeRef: setDeleteRef, isOver: isDeleteOver } = useDroppable({
    id: `delete-${id}`,
    data: {
      type: 'delete-zone',
      accepts: ['task']
    }
  })
  
  const columnRef = React.useRef(null)
  const [overlayDimensions, setOverlayDimensions] = React.useState({})
  const [deleteZoneRect, setDeleteZoneRect] = React.useState(null)
  const [removingTaskId, setRemovingTaskId] = React.useState(null)
  
  React.useEffect(() => {
    if (columnRef.current) {
      const rect = columnRef.current.getBoundingClientRect()
      setOverlayDimensions({
        left: rect.left,
        width: rect.width,
        gradientStart: rect.top
      })
      setDeleteZoneRect({
        top: rect.top - 80, // Увеличиваем отступ сверху
        left: rect.left,
        width: rect.width
      })
    }
  }, [])

  React.useEffect(() => {
    if (isDeleteOver && activeTaskId && !removingTaskId) {
      setRemovingTaskId(activeTaskId)
    } else if (!isDeleteOver && removingTaskId) {
      // Add delay before removing the task id to allow exit animation
      setTimeout(() => {
        setRemovingTaskId(null)
      }, 200) // Match animation duration
    }
  }, [isDeleteOver, activeTaskId])

  return (
    <div ref={(el) => {
      setNodeRef(el)
      columnRef.current = el
    }} className={styles.columnContainer}>
      <div 
        ref={setDeleteRef}
        className={`${styles.deleteZone} ${isDeleteOver ? styles.active : ''}`}
        style={{
          position: 'fixed',
          top: deleteZoneRect?.top,
          left: deleteZoneRect?.left,
          width: deleteZoneRect?.width
        }}
      >
        отпустите, чтобы удалить
      </div>
      <div
        className={styles.headerOverlay}
        style={{
          left: overlayDimensions.left,
          width: overlayDimensions.width,
          height: overlayDimensions.gradientStart
        }}
      />
      <div className={styles.headerContainer}>
        <h2 className={styles.columnTitle}>{column.title}</h2>
      </div>
      <div className={styles.headerGradient} />
      <SortableContext 
        items={tasks.map(task => task.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.taskList}>
          {tasks.map(task => (
            <Task 
              key={task.id} 
              task={task}
              isRemoving={pendingRemovals[task.id]}
              isDeletionPlaceholder={task.id === activeTaskId && isDeleteOver}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column
