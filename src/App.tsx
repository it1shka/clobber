import BoardPane from './BoardPane'
import ControlPane from './ControlPane'

const App = () => {
  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="flex-3/4">
        <BoardPane />
      </div>
      <div className="flex-1/4">
        <ControlPane />
      </div>
    </div>
  )
}

export default App
