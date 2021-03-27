import "@emotion/react"
import {Theme as SnovyTheme} from "./src/data/model/options/Theme"

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends SnovyTheme {}
}

// declare module "@emotion/react" {
//   export interface Theme {
//     primary: string
//     secondary: string
//     textPrimary: string
//     textSecondary: string
//     accent: string
//     border: string
//     hover: string
//     activeItem: string
//   }
// }