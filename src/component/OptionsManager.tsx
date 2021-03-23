import React, {useContext, useState} from "react"
import {css} from "@emotion/react"
import Options, {defaultOptions} from "../data/model/options/Options"
import {TextButton} from "./inputs/Button"
import OptionsContext from "../util/OptionsContext"
import ThemeManager from "./options/ThemeManager"

interface OptionsProps {
  activeOptions: Options
  saveOptions: (options: Options) => void
}

const OptionsManager = ({activeOptions, saveOptions, ...props}: OptionsProps) => {

  const theme = useContext(OptionsContext).theme

  const [options, setOptions] = useState(activeOptions.copy())

  const updateTheme = (field: string, hex: string) => {
    options.theme[field] = hex
  }

  return (
    <div className="snovy-options" css={css`background-color: ${theme.secondary};`}>
      <ThemeManager theme={options.theme} updateTheme={updateTheme}/>
      <div id="control-buttons">
        <TextButton value="Restore defaults" onClick={() => setOptions(defaultOptions)}/>
        <TextButton value="Cancel" onClick={() => setOptions(activeOptions.copy())}/>
        <TextButton value="Save" onClick={() => saveOptions(options)}/>
      </div>
    </div>
  )

}

export default OptionsManager