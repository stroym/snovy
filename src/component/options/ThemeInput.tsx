import React from "react"
import {ColoredInput} from "../inputs/Input"
import WithLabel from "../inputs/WithLabel"

interface ThemeItemProps {
  label: string
  currentColor: string
  defaultColor: string
  setColor: (hex: string) => void
}

const ThemeInput = ({label, currentColor, defaultColor, setColor}: ThemeItemProps) => {

  return (
    <WithLabel value={label} position="before">
      <ColoredInput observe value={currentColor} defaultValue={defaultColor} onValueChange={setColor}/>
    </WithLabel>
  )

}

export default ThemeInput