import { createPortal } from 'react-dom'
import BoardPane from './BoardPane'
import ControlPane from './ControlPane'
import GameTreePane from './GameTreePane'

const App = () => {
  return (
    <>
      <div className="h-screen w-screen flex flex-row">
        <div className="flex-3/4">
          <BoardPane />
        </div>
        <div className="flex-1/4">
          <ControlPane />
        </div>
      </div>
      {createPortal(<GameTreePane />, document.body)}
    </>
  )
}

export default App
