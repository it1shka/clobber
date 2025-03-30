import Board from './Board'

const App = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-[#eee]">
      <div className="h-[600px] w-[500px]">
        <Board
          pieces={[
            {
              row: 1,
              column: 1,
              color: 'white',
            },
            {
              row: 2,
              column: 2,
              color: 'black',
            },
            {
              row: 2,
              column: 3,
              color: 'black',
            },
          ]}
          highlight={[
            {
              row: 1,
              column: 1,
            },
            {
              row: 2,
              column: 2,
            },
            {
              row: 3,
              column: 3,
            },
            { row: 4, column: 3 },
          ]}
        />
      </div>
    </div>
  )
}

export default App
