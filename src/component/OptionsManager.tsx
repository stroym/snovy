import React, {useContext, useEffect, useState} from "react"
import {css} from "@emotion/react"
import {defaultOptions} from "../data/model/options/Options"
import {TextButton} from "./inputs/Button"
import OptionsContext from "../util/OptionsContext"
import ThemeManager from "./options/ThemeManager"
import {Theme} from "../data/model/options/Theme"

const OptionsManager = () => {

  const context = useContext(OptionsContext)

  const [options, setOptions] = useState(context.options.copy())

  const [currentTheme, setCurrentTheme] = useState(context.theme.copy())

  const [themes, setThemes] = useState<Array<Theme>>([])

  useEffect(
    () => {
      async function fetchThemes() {
        setThemes(await context.getThemes())
      }

      fetchThemes()
    }, []
  )

  useEffect(
    () => {
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
      <ThemeManager themes={themes} theme={currentTheme} setTheme={value => value && setCurrentTheme(value)}/>
      <div id="control-buttons">
        <TextButton value="Restore defaults" onClick={() => setOptions(defaultOptions.copy())}/>
        <TextButton value="Cancel" onClick={() => setOptions(context.options.copy())}/>
        <TextButton value="Save" onClick={submit}/>
      </div>
    </div>
  )

}

export default OptionsManager