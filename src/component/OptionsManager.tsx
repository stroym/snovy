import React, {useContext} from "react"
import OptionsContext from "../util/OptionsContext"
import {SynchronizedInput} from "./inputs/Input"

const OptionsManager = () => {

  const options = useContext(OptionsContext)

  const style: React.CSSProperties = {
    backgroundColor: options.theme.primaryColor
  }

  return (
    <div className="snovy-options" style={style}>
      <SynchronizedInput style={{backgroundColor: options.theme.secondaryColor}}/>
    </div>
  )

}

export default OptionsManager