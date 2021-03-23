import React from "react"
import {ColoredInput} from "../inputs/Input"
import WithLabel from "../inputs/WithLabel"
import {Theme} from "../../data/model/options/Theme"

interface ThemeProps {
  theme: Theme
  updateTheme: (field: string, hex: string) => void
}

const ThemeManager = ({theme, updateTheme, ...props}: ThemeProps) => {

  return (
    <div id="theme-options" className="snovy-options-container">
      {Object.keys(theme).map((it, index) =>
        <WithLabel key={index} value={it} position="before">
          <ColoredInput
            observe value={theme[it]} defaultValue={theme[it]}
            onValueChange={value => updateTheme(it, value)}
          />
        </WithLabel>
      )}
    </div>
  )

}

export default ThemeManager