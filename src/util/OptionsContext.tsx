import React, {useEffect, useState} from "react"
import Options from "../data/model/options/Options"
import {Theme} from "../data/model/options/Theme"
import {dexie} from "../index"
import {defaults} from "../data/model/options/Defaults"
import {css, Global, ThemeProvider} from "@emotion/react"
import {fetchThemes} from "../data/Database"

const OptionsContext = React.createContext<OptionsContextType>({
  options: defaults.options,
  setOptions: () => false
})

interface OptionsContextType {
  options: Options
  setOptions: (options: Options) => void
}

export const OptionsProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {

  //TODO these things should probably be set using the methods below...
  const [options, setIntOptions] = useState<Options>(defaults.options)
  const [theme, setTheme] = useState<Theme>(defaults.themes.first()!)

  useEffect(
    () => {
      dexie.transaction("rw", [dexie.options, dexie.themes], async () => {
        await fetchThemes()
        await initOptions().then(options => setOptions(options))
      })
    }, []
  )

  const initOptions = async () => {
    return await dexie.options.toArray().then(async (options) => {
      return options.isEmpty() ? await defaults.options.create() : await options.first()!.load()
    })
  }

  const setOptions = async (options: Options) => {
    await dexie.themes.get(options.themeId)
      .then(async (loaded) => {
        if (loaded) {
          setTheme(loaded)
        } else {
          throw Error(`Theme with id ${options.themeId} not found!`)
        }
      })
      .catch(async (error) => {
        console.error(`Error while fetching theme! Reverting to default theme...\n${error}`)

        const backup = (await fetchThemes()).first()!
        setTheme(backup)
        options.themeId = backup.id
      })

    setIntOptions(options)
  }

  return (
    <OptionsContext.Provider value={{options, setOptions}}>
      <Global
        styles={css`
          [data-fontsize="small"] {
            font-size: calc(8px + 0.5vw);
          }

          [data-fontsize="medium"] {
            font-size: calc((8px + 0.5vw) * 1.5);
          }

          [data-fontsize="big"] {
            font-size: calc((8px + 0.5vw) * 2);
          }
        `}
      />
      <ThemeProvider theme={theme}>
        {props.children}
      </ThemeProvider>
    </OptionsContext.Provider>
  )
}

export default OptionsContext
