import {Theme} from "./Theme"
import Options from "./Options"

const options = new Options(-1, false)

const dark = new Theme(
  "plaindark",
  "#282424",
  "#f8f8ff",
  "#000000",
  "#a9a9a9",
  "#3c3737",
  "#d3d3d3",
  "#c0c0c0"
)

const light = new Theme(
  "plainlight",
  "#b0a1a1",
  "#000000",
  "#f8f8ff",
  "#a9a9a9",
  "#3c3737",
  "#d3d3d3",
  "#c0c0c0"
)

const green = Theme.makeFrom(
  dark,
  "greendark",
  {
    accent: "#556b2f",
    hover: "#6a6a00",
    activeItem: "#9b9b00"
  }
)

const neon = Theme.makeFrom(
  dark,
  "neondark",
  {
    accent: "#7500a7",
    hover: "#be37ff",
    activeItem: "#00dbdb",
    border: "#095f5f"
  }
)

export const defaults = {
  options: options,
  themes: [dark, light, green, neon]
}