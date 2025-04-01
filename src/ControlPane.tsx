const ControlPane = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="p-4 font-bold border-b-4 border-[#eee]">Controls</h2>
      <div className="flex-1 flex flex-col p-4 items-center">
        <button className="border-4 border-green-500 w-full p-1 rounded-xl text-green-500 cursor-pointer hover:border-green-400 hover:text-green-400">
          Show Game Tree
        </button>
      </div>
    </div>
  )
}

export default ControlPane
