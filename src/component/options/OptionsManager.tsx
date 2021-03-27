import React, {useContext, useEffect, useState} from "react"
import {css, useTheme} from "@emotion/react"
import OptionsContext from "../../util/OptionsContext"
import {TextButton} from "../inputs/Button"
import ThemeManager from "./ThemeManager"
import {Theme} from "../../data/model/options/Theme"
import {dexie} from "../../index"
import {defaults} from "../../data/model/options/Defaults"
import {fetchThemes} from "../../data/Database"

//TODO border css class?

const OptionsManager = () => {

  const activeTheme = useTheme()

  const context = useContext(OptionsContext)

  const [options, setOptions] = useState(context.options.clone())
  const [theme, setTheme] = useState<Theme>(defaults.themes.first()!)

  const [themes, setThemes] = useState<Array<Theme>>([])

  useEffect(
    () => {
      getThemes()
    }, []
  )

  async function getThemes() {
    const themes = await fetchThemes()

    setThemes(themes)
    setTheme(themes.find(it => it.id == options.themeId)!)
  }

  const fetchTheme = async () => {
    setTheme((await dexie.themes.get(options.themeId))!)
  }

  const submit = async () => {
    await theme.save()
    options.themeId = theme.id
    context.setOptions(await options.save())
    //update current options etc.
  }

  return (
    <div
      className="snovy-options"
      css={css`
        .snovy-combo-box {
          border-style: solid;
          border-width: 1px;

          .snovy-dropdown {
            top: 1px;
            left: -1px;
            width: calc(100% + 2px);
          }
        }

        &, * {
          color: ${activeTheme.textPrimary};
          background-color: ${activeTheme.secondary};
          border-color: ${activeTheme.textPrimary};
        }
      `}
    >
      <ThemeManager themes={themes} setThemes={setThemes} currentTheme={theme} setCurrentTheme={setTheme}/>
      <div id="control-buttons">
        <TextButton
          value="Restore defaults" onClick={() => {
          const themes = Array.from(defaults.themes)
          setTheme(themes.first()!)
          setOptions(defaults.options.clone())
          setThemes(themes)
        }}
        />
        <TextButton
          value="Cancel" onClick={async () => {
          await getThemes()

          const options = context.options.clone()
          setOptions(options)
          await fetchTheme()
          // setTheme((await dexie.themes.get(options.themeId))!)
        }}
        />
        <TextButton value="Save" onClick={submit}/>
      </div>
    </div>
  )

  //TODO restore defaults should probably reset themes as well... or at least check if the default theme exists in db

}

export default OptionsManager