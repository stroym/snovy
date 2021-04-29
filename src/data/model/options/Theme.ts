import {Titled} from "../Base"
import {dexie} from "../../../index"

export class Theme extends Titled {

  primary: string

  textPrimary: string
  textSecondary: string

  accent: string
  border: string
  hover: string

  activeItem: string

  constructor(title: string, primary: string, textPrimary: string, textSecondary: string, accent: string,
              border: string, hover: string, activeItem: string, id?: number) {
    super(title, id)
    this.primary = primary
    this.textPrimary = textPrimary
    this.textSecondary = textSecondary
    this.accent = accent
    this.border = border
    this.hover = hover
    this.activeItem = activeItem
  }

  static makeFrom(source: Theme, title: string, colors?: {
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
      colors?.primary ? colors.primary : source.primary,
      colors?.textPrimary ? colors.textPrimary : source.textPrimary,
      colors?.textSecondary ? colors.textSecondary : source.textSecondary,
      colors?.accent ? colors.accent : source.accent,
      colors?.border ? colors.border : source.border,
      colors?.hover ? colors.hover : source.hover,
      colors?.activeItem ? colors.activeItem : source.activeItem
    )
  }

  static makeEmpty() {
    return new Theme("", "", "", "", "", "", "", "")
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
      dexie.themes.put(this, this.id)
    }).then(_it => this)
  }

  toString(): string {
    return this.title
  }

  clone() {
    return Object.create(this)
  }

}