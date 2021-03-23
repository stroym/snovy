import React, {useContext} from "react"
import OptionsContext from "../../util/OptionsContext"
import {ButtonProps} from "./Button"
import {InputProps} from "./Input"

interface LabelProps {
  value: string
  position: "before" | "after"
  children: InputProps | ButtonProps
}

export const WithLabel = ({children, value, position}: LabelProps) => {

  const theme = useContext(OptionsContext).theme

  const label = <div className="label-text" style={{color: theme.textPrimary}}>{value}</div>

  return (
    <label className="labeled-input-wrapper">
      {position == "before" && label}
      {children}
      {position == "after" && label}
    </label>
  )
}

export default WithLabel