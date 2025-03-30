import Board from './Board'

const App = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#eee]">
      <div className="h-[600px] w-[500px]">
        <Board />
      </div>
    </div>
  )
}

export default App
