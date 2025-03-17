import { useState } from 'react'
import styles from './styles/KanbanBoard.module.css'
import Column from './Column'
import Task from './Task'
import { initialData } from './initialData'
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

// Custom modifier to restrict movement to the vertical axis
const restrictToVerticalAxis = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  }
}

const initialDropAnimation = {
  keyframes: ({ transform }) => [
    { transform: CSS.Transform.toString(transform.initial) },
    { transform: CSS.Transform.toString(transform.final) }
  ],
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  duration: 150,
}

function KanbanBoard() {
  const [board, setBoard] = useState(initialData)
  const [activeTask, setActiveTask] = useState(null)
  const [sourceColumnId, setSourceColumnId] = useState(null)
  const [pendingRemovals, setPendingRemovals] = useState({})
  const [dropAnimation, setDropAnimation] = useState(initialDropAnimation)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const onDragStart = ({ active }) => {
    setActiveTask(board.tasks[active.id])
    setSourceColumnId(Object.keys(board.columns).find(columnId =>
      board.columns[columnId].taskIds.includes(active.id)
    ))
  }

  const onDragOver = ({ active, over }) => {
    if (!over || !active || !sourceColumnId) return

    const activeId = active.id
    const overId = over.id
    
    // Only handle same-column sorting
    const targetColumnId = Object.keys(board.columns).find(columnId =>
      board.columns[columnId].taskIds.includes(overId)
    )

    if (targetColumnId === sourceColumnId) {
      const column = board.columns[sourceColumnId]
      const oldIndex = column.taskIds.indexOf(activeId)
      const newIndex = column.taskIds.indexOf(overId)

      if (oldIndex !== newIndex) {
        setBoard(prev => {
          const newTaskIds = [...prev.columns[sourceColumnId].taskIds]
          newTaskIds.splice(oldIndex, 1)
          newTaskIds.splice(newIndex, 0, activeId)

          return {
            ...prev,
            columns: {
              ...prev.columns,
              [sourceColumnId]: {
                ...column,
                taskIds: newTaskIds
              }
            }
          }
        })
      }
    }
  }

  const onDragEnd = ({ active, over }) => {
    if (over?.id?.startsWith('delete-')) {
      setDropAnimation(null) // отключаем анимацию возврата
      const columnId = sourceColumnId
      if (columnId) {
        setPendingRemovals(prev => ({ ...prev, [active.id]: true }))
        setTimeout(() => {
          setBoard(prev => {
            const column = prev.columns[columnId]
            return {
              ...prev,
              columns: {
                ...prev.columns,
                [columnId]: {
                  ...column,
                  taskIds: column.taskIds.filter(id => id !== active.id)
                }
              },
              tasks: Object.fromEntries(
                Object.entries(prev.tasks).filter(([key]) => key !== active.id)
              )
            }
          })
          setPendingRemovals(prev => {
            const next = { ...prev }
            delete next[active.id]
            return next
          })
          setDropAnimation(initialDropAnimation) // возвращаем анимацию
        }, 300)
      }
    }
    setActiveTask(null)
    setSourceColumnId(null)
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]} // Restrict movement to vertical axis
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className={styles.boardContainer}>
        {board.columnOrder.map((columnId) => (
          <Column 
            key={columnId}
            id={columnId}
            column={board.columns[columnId]}
            tasks={board.columns[columnId].taskIds.map(id => board.tasks[id])}
            activeTaskId={activeTask?.id}
            pendingRemovals={pendingRemovals}
          />
        ))}
      </div>
      <DragOverlay 
        dropAnimation={dropAnimation}
        zIndex={1}
        style={{ 
          transformOrigin: '0 0',
          pointerEvents: 'none',
        }}
      >
        {activeTask ? <Task task={activeTask} className={styles.overlayTask} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
