import MiscControls from './MiscControls'
import SizeControls from './SizeControls'

const ControlPane = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="p-4 font-bold border-b-4 border-[#eee]">Controls</h2>
      <MiscControls />
      <SizeControls />
    </div>
  )
}

export default ControlPane
