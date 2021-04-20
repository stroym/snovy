import React, {useContext, useLayoutEffect, useRef, useState} from "react"
import {css} from "@emotion/react"
import OptionsContext from "../../util/OptionsContext"
import {Button} from "../inputs/Button"
import ThemeManager from "./ThemeManager"
import {Theme} from "../../data/model/options/Theme"
import {dexie} from "../../index"
import {defaults} from "../../data/model/options/Defaults"
import {exportData, fetchThemes, importData} from "../../data/Database"
import WithLabel from "../inputs/WithLabel"
import {default as ExportIcon} from "../../../public/icons/import.svg"
import {default as ImportIcon} from "../../../public/icons/export.svg"

const OptionsManager = () => {

  const importRef = useRef<HTMLInputElement>(null)

  const context = useContext(OptionsContext)

  const [unsavedChanges, setUnsavedChanges] = useState(false) //TODO track changes...

  const [options, setOptions] = useState(context.options.clone())
  const [theme, setTheme] = useState<Theme>(defaults.themes.first()!)

  const [themes, setThemes] = useState<Array<Theme>>([])

  useLayoutEffect(
    () => {
      getThemes()

      return () => {
        if (unsavedChanges && (confirm("You have unsaved changes. Would you like to save them?"))) {
          submit()
        } else {
          cancel()
        }
      }
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

  const restore = async () => {
    const themes = Array.from(defaults.themes)
    setTheme(themes.first()!)
    setOptions(defaults.options.clone())
    setThemes(themes)
  }

  const cancel = async () => {
    await getThemes()

    const options = context.options.clone()
    setUnsavedChanges(false)
    setOptions(options)
    await fetchTheme()
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
      `}
    >
      <div id="import-export" className="snovy-options-container">
        <WithLabel value="Import" position="before" vertical>
          <Button preset="provided" onClick={() => importRef.current?.click()}><ImportIcon/></Button>
          <input ref={importRef} type="file" onChange={e => importData(e.target.files)} style={{display: "none"}}/>
        </WithLabel>
        <WithLabel value="Export" position="before" vertical>
          <Button preset="provided" onClick={exportData}><ExportIcon/></Button>
        </WithLabel>
      </div>
      <ThemeManager themes={themes} setThemes={setThemes} currentTheme={theme} setCurrentTheme={setTheme}/>
      <div id="control-buttons">
        <Button value="Restore defaults" onClick={restore}/>
        <Button value="Cancel" onClick={cancel}/>
        <Button value="Save" onClick={submit}/>
      </div>
    </div>
  )

  //TODO restore defaults should probably reset themes as well... or at least check if the default theme exists in db

}

export default OptionsManager