import React from "react"
import Options, {defaultOptions} from "../data/model/options/Options"
// import Theme, {defaultTheme} from "../data/model/options/Theme"

const OptionsContext = React.createContext<Options>(defaultOptions)
export default OptionsContext

// export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)
//
// type ThemeContextType = {
//   activeTheme: Theme | undefined
//   setActiveTheme: React.Dispatch<React.SetStateAction<Theme>>
// }
//
// export const ThemeProvider = (props: {
//   children: Array<React.ReactElement> | React.ReactElement
// }) => {
//   const [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme)
//
//   return (
//     <ThemeContext.Provider
//       value={{
//         activeTheme,
//         setActiveTheme
//       }}
//     >
//       {props.children}
//     </ThemeContext.Provider>
//   )
//
// }