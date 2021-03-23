export class Theme {

  primary: string
  secondary: string

  accent: string

  border: string

  textPrimary: string
  textSecondary: string

  activeItem: string
  selectedItem: string
  hover: string
  focus: string
  scrollbar: string

  constructor(primary: string, secondary: string, accent: string, borderColor: string,
              textPrimary: string, textSecondary: string, activeItem: string, selectedItem: string,
              hover: string, focusColor: string, scrollbar: string) {
    this.primary = primary
    this.secondary = secondary
    this.accent = accent
    this.border = borderColor
    this.textPrimary = textPrimary
    this.textSecondary = textSecondary
    this.activeItem = activeItem
    this.selectedItem = selectedItem
    this.hover = hover
    this.focus = focusColor
    this.scrollbar = scrollbar
  }

}

export const defaultTheme = new Theme(
  "#282424",
  "#3c3737",
  "#556b2f",
  "#000000",
  "#f8f8ff",
  "#000000",
  "#9b9b00",
  "#7c7c00",
  "#bdb76b",
  "#98ff5e",
  "#006400"
)

// export const defaultTheme = new Map<string, string>([
//   ["primary", "#282424"],
//   ["secondary", "#3c3737"],
//   ["accent", "#556b2f"],
//   ["border", "#000000"],
//   ["textPrimary", "#f8f8ff"],
//   ["textSecondary", "#000000"],
//   ["activeItem", "#9b9b00"],
//   ["selectedItem", "#7c7c00"],
//   ["hover", "#bdb76b"],
//   ["focus", "#98ff5e"],
//   ["scrollbar", "#006400"]
// ])