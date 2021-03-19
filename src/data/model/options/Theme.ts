export class Theme {

  constructor(
    public primaryColor: string,
    public secondaryColor: string,
    public accentColor: string,
    public borderColor: string,
    public primaryTextColor: string,
    public secondaryTextColor: string,
    public activeItemColor: string,
    public selectedItemColor: string,
    public hoverItemColor: string,
    public focusItemColor: string,
    public scrollbarColor: string
  ) {
  }

}

export const defaultTheme = new Theme(
  "#282424",
  "#3c3737",
  "darkolivegreen",
  "black",
  "ghostwhite",
  "black",
  "#9b9b00",
  "#7c7c00",
  "darkkhaki",
  "#98ff5e",
  "darkgreen"
)