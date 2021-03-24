import {Titled} from "../Base"
import {dexie} from "../../../index"
import {deserialize, serialize} from "class-transformer"

export class Theme extends Titled {

  primary: string
  secondary: string

  textPrimary: string
  textSecondary: string

  accent: string
  border: string
  hover: string

  activeItem: string

  constructor(title: string, primary: string, secondary: string, textPrimary: string, textSecondary: string, accent: string,
              border: string, hover: string, activeItem: string, id?: number) {
    super(title, id)
    this.primary = primary
    this.secondary = secondary
    this.textPrimary = textPrimary
    this.textSecondary = textSecondary
    this.accent = accent
    this.border = border
    this.hover = hover
    this.activeItem = activeItem
  }

  static makeFrom(source: Theme, title: string, colors: {
    primary?: string
    secondary?: string
    textPrimary?: string
    textSecondary?: string
    accent?: string
    border?: string
    hover?: string
    activeItem?: string
  }) {
    return new Theme(
      title,
      colors.primary ? colors.primary : source.primary,
      colors.secondary ? colors.secondary : source.secondary,
      colors.textPrimary ? colors.textPrimary : source.textPrimary,
      colors.textSecondary ? colors.textSecondary : source.textSecondary,
      colors.accent ? colors.accent : source.accent,
      colors.border ? colors.border : source.border,
      colors.hover ? colors.hover : source.hover,
      colors.activeItem ? colors.activeItem : source.activeItem
    )
  }

  async create() {
    return dexie.transaction("rw", dexie.themes, () => {dexie.themes.add(this)}).then(_it => this)
  }

  async delete() {
    return dexie.transaction("rw", dexie.themes, () => {dexie.themes.delete(this.id)})
      .then(_result => true).catch(_result => false)
  }

  async load() {
    return Promise.all([]).then(_it => this)
  }

  async save() {
    return dexie.transaction("rw", dexie.themes, async () => {
      await dexie.options.clear()

      dexie.themes.put(this, this.id)
    }).then(_it => this)
  }

  toString(): string {
    return this.title
  }

  copy() {
    return deserialize(Theme, serialize(this))
  }

}

const dark = new Theme(
  "plaindark",
  "#282424",
  "#3c3737",
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
  "#9f9898",
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
    hover: "#cdcd00",
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

export const builtinThemes = [
  dark,
  light,
  green,
  neon
]