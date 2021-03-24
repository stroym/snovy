import React, {useContext, useEffect, useState} from "react"
import {css} from "@emotion/react"
import {defaultOptions} from "../data/model/options/Options"
import {TextButton} from "./inputs/Button"
import OptionsContext from "../util/OptionsContext"
import ThemeManager from "./options/ThemeManager"

const OptionsManager = () => {

  const context = useContext(OptionsContext)

  const [options, setOptions] = useState(context.options.copy())

  const [currentTheme, setCurrentTheme] = useState(context.theme.copy())

  useEffect(
    () => {
      console.log(options)
      setCurrentTheme(context.theme.copy())
    }, [options]
  )

  const submit = async () => {
    const opt = options
    opt.themeId = currentTheme.id
    context.setOptions(await opt.save())
  }

  return (
    <div
      className="snovy-options"
      css={css`
        .snovy-combo-box-input-wrapper {
          border-style: solid;
          border-width: 1px;
        }

        &, * {
          color: ${context.theme.textPrimary};
          border-color: ${context.theme.textPrimary};
          background-color: ${context.theme.secondary};
        }
      `}
    >
      <ThemeManager theme={currentTheme} setTheme={setCurrentTheme}/>
      <div id="control-buttons">
        <TextButton value="Restore defaults" onClick={() => setOptions(defaultOptions.copy())}/>
        <TextButton value="Cancel" onClick={() => setOptions(context.options.copy())}/>
        <TextButton value="Save" onClick={submit}/>
      </div>
    </div>
  )

}

export default OptionsManager