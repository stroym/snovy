import React, {useState} from "react"
import {ColoredInput} from "./inputs/Input"
import WithLabel from "./inputs/WithLabel"
import {css} from "@emotion/react"
import Options from "../data/model/options/Options"
import {ConfirmButton} from "./inputs/Button"

const OptionsManager = (props: {
  options: Options
  updateOptions: (options: Options) => void
}) => {

  const [options, setOptions] = useState(props.options)

  return (
    <div
      className="snovy-options"
      css={css`
        background-color: ${options.theme.secondaryColor};
      `}
    >
      <div id="theme-options" className="snovy-options-container">
        {Object.keys(options.theme).map((it, index) =>
          <WithLabel key={index} value={it.replaceAll("Color", "")} position="before">
            <ColoredInput
              observe value={options.theme[it]} onValueChange={(value) => {options.theme[it] = value}}
            />
          </WithLabel>
        )}
      </div>
      <ConfirmButton onClick={() => props.updateOptions(options)}/>
    </div>
  )

}

export default OptionsManager