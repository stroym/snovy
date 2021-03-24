import React, {useState} from "react"
import Options, {defaultOptions} from "../data/model/options/Options"
import {builtinThemes, Theme} from "../data/model/options/Theme"
import {dexie} from "../index"

const OptionsContext = React.createContext<OptionsContextType>({
  options: defaultOptions,
  setOptions: () => false,
  theme: builtinThemes.first()!,
  setTheme: () => false
})

interface OptionsContextType {
  options: Options
  setOptions: (options: Options) => void
  theme: Theme
  setTheme: (options: Theme) => void
}

export const OptionsProvider = (props: {
  children: Array<React.ReactElement> | React.ReactElement
}) => {
  const [options, setIntOptions] = useState<Options>(defaultOptions)
  const [theme, setTheme] = useState<Theme>(builtinThemes.first()!)

  const setOptions = async (options: Options) => {
    setIntOptions(options)

    if (dexie.isOpen()) {
      setTheme((await dexie.themes.get(options.themeId))!)
    }
  }

  return (
    <OptionsContext.Provider
      value={{
        options,
        setOptions,
        theme,
        setTheme
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  )
}

export default OptionsContext
