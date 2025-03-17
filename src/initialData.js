export const initialData = {
  tasks: {
    'task-1': { id: 'task-1', title: 'Купить воздушные шары', description: 'Описание задачи 1. Описание задачи 1. Описание задачи 1. Описание задачи 1. Описание задачи 1' },
    'task-2': { id: 'task-2', title: 'Задача 2', description: '~2 часа' },
    'task-3': { id: 'task-3', title: 'Задача 3', description: 'Описание задачи 3' },
    'task-4': { id: 'task-4', title: 'Задача 4', description: 'Описание задачи 4' },
    'task-5': { id: 'task-5', title: 'Задача 5', description: 'Описание задачи 5' },
    'task-6': { id: 'task-6', title: 'Задача 6', description: 'Описание задачи 6' },
    'task-7': { id: 'task-7', title: 'Задача 7', description: 'Описание задачи 7' },
    'task-8': { id: 'task-8', title: 'Задача 8', description: 'Описание задачи 8' },
    'task-9': { id: 'task-9', title: 'Задача 9', description: 'Описание задачи 9' },
    'task-10': { id: 'task-10', title: 'Задача 10', description: 'Описание задачи 10' },
    'task-11': { id: 'task-11', title: 'Задача 11', description: 'Описание задачи 11' },
    'task-12': { id: 'task-12', title: 'Задача 12', description: 'Описание задачи 12' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Запланировано',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'В Процессе',
      taskIds: ['task-5', 'task-6', 'task-7'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Сделано',
      taskIds: ['task-9', 'task-10', 'task-11', 'task-12'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
}
