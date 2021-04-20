import "@emotion/react"
import {Theme as SnovyTheme} from "../src/data/model/options/Theme"

declare module "@emotion/react" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends SnovyTheme {}
}