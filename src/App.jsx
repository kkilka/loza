import './styles/fonts.css'
import './styles/theme.css'
import styles from './styles/App.module.css'

import KanbanBoard from './KanbanBoard'

function App() {
  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <h1>Kanban Board</h1>
      </header>
      <KanbanBoard />
    </div>
  )
}

export default App
