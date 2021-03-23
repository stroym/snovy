export class Theme {

  primaryColor: string
  secondaryColor: string

  accentColor: string

  borderColor: string

  primaryTextColor: string
  secondaryTextColor: string

  activeColor: string
  selectedColor: string
  hoverColor: string
  focusColor: string
  scrollbarColor: string

  constructor(primaryColor: string, secondaryColor: string, accentColor: string, borderColor: string,
              primaryTextColor: string, secondaryTextColor: string, activeColor: string, selectedColor: string,
              hoverColor: string, focusColor: string, scrollbarColor: string) {
    this.primaryColor = primaryColor
    this.secondaryColor = secondaryColor
    this.accentColor = accentColor
    this.borderColor = borderColor
    this.primaryTextColor = primaryTextColor
    this.secondaryTextColor = secondaryTextColor
    this.activeColor = activeColor
    this.selectedColor = selectedColor
    this.hoverColor = hoverColor
    this.focusColor = focusColor
    this.scrollbarColor = scrollbarColor
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