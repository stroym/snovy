import React from "react"
import Options, {defaultOptions} from "../data/model/options/Options"

const OptionsContext = React.createContext<Options>(defaultOptions)
export default OptionsContext