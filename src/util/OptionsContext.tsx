import React, {useEffect, useState} from "react"
import Options from "../data/model/options/Options"
import {Theme} from "../data/model/options/Theme"
import {dexie} from "../index"
import {defaults} from "../data/model/options/Defaults"

const OptionsContext = React.createContext<OptionsContextType>({
  options: defaults.options,
  setOptions: () => false,
  theme: defaults.themes.first()!,
  setTheme: () => false,
  getThemes: async () => new Array<Theme>()
})

interface OptionsContextType {
  options: Options
  setOptions: (options: Options) => void
  theme: Theme
  setTheme: (options: Theme) => void
  getThemes: () => Promise<Array<Theme>>
}

export const OptionsProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {

  //TODO these things should probably be set using the methods below...
  const [options, setIntOptions] = useState<Options>(defaults.options)
  const [theme, setTheme] = useState<Theme>(defaults.themes.first()!)

  const initOptions = async () => {
    return await dexie.options.toArray().then(async (options) => {
      return options.isEmpty() ? await defaults.options.create() : await options.first()!.load()
    })
  }

  useEffect(
    () => {
      dexie.transaction("rw", [dexie.options, dexie.themes], async () => {
        await getThemes()
        await initOptions().then(options => setOptions(options))
      })
    }, []
  )

  const getThemes = async () => {
    return dexie.themes.toArray().then(async (loadedThemes) => {
      if (loadedThemes.isEmpty()) {
        for (const theme of defaults.themes) {
          await theme.create()
        }

        return await dexie.themes.toArray()
      } else {
        return loadedThemes
      }
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

        const backup = (await getThemes()).first()!
        setTheme(backup)
        options.themeId = backup.id
      })

    setIntOptions(options)
  }

  return (
    <OptionsContext.Provider
      value={{
        options,
        setOptions,
        theme,
        setTheme,
        getThemes
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  )
}

export default OptionsContext
