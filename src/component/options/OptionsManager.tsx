import React, {useContext, useEffect, useState} from "react"
import {css} from "@emotion/react"
import OptionsContext from "../../util/OptionsContext"
import {TextButton} from "../inputs/Button"
import ThemeManager from "./ThemeManager"
import {Theme} from "../../data/model/options/Theme"
import {dexie} from "../../index"
import {defaults} from "../../data/model/options/Defaults"

//TODO border css class?

const OptionsManager = () => {

  const context = useContext(OptionsContext)

  const [options, setOptions] = useState(context.options.clone())
  const [theme, setTheme] = useState<Theme>(context.theme.clone())

  useEffect(
    () => {
      async function findTheme() {
        setTheme((await dexie.themes.get(options.themeId))!)
      }

      findTheme()
    }, [options]
  )

  const submit = async () => {
    options.themeId = theme.id
    context.setOptions(await options.save())
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
      <ThemeManager currentTheme={theme} setCurrentTheme={setTheme}/>
      <div id="control-buttons">
        <TextButton
          value="Restore defaults" onClick={async () => setOptions(await defaults.options.clone().load())}
        />
        <TextButton value="Cancel" onClick={() => setOptions(context.options.clone())}/>
        <TextButton value="Save" onClick={submit}/>
      </div>
    </div>
  )

  //TODO restore defaults should probably reset themes as well... or at least check if the default theme exists in db

}

export default OptionsManager