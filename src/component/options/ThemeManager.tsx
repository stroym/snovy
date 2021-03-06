import React from "react"
import {Theme} from "../../data/model/options/Theme"
import ComboBox from "../combo_box/ComboBox"
import {css} from "@emotion/react"
import WithLabel from "../inputs/WithLabel"
import {Button} from "../inputs/Button"
import FocusTrap from "focus-trap-react"
import {SynchronizedInput} from "../inputs/Input"
import ThemeInput from "./ThemeInput"

interface ThemeProps {
  currentTheme: Theme
  setCurrentTheme: (theme: Theme) => void
  themes: Array<Theme>
  setThemes: (themes: Array<Theme>) => void
}

//TODO add option to disable accent color on sidebars?
const ThemeManager = ({themes, setThemes, currentTheme, setCurrentTheme}: ThemeProps) => {

  const deleteTheme = () => {
    const tempThemes = Array.from(themes)
    setCurrentTheme(tempThemes.deleteAndGet(currentTheme)!)
    setThemes(tempThemes)
  }

  const createTheme = async () => {
    setThemes([...Array.from(themes), Theme.makeFrom(currentTheme, currentTheme.title)])
  }

  return (
    <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
      <div
        id="theme-options" className="snovy-options-container"
        css={css`
          .label-text,
          #title-input,
          .snovy-combo-box,
          .colored-input-wrapper {
            width: 50%;
          }

          .color-input {
            width: 100%;
          }`
        }
      >
        <div
          className="inputs-wrapper" css={css`
          .labeled-input-wrapper {
            padding: 0.2em 0;
          }
        `}
        >
          <ComboBox
            label={{value: "Active theme", position: "before"}}
            items={themes} selected={currentTheme} onSelect={value => value && setCurrentTheme(value)}
          />
          <WithLabel value="Theme name" position="before">
            <SynchronizedInput
              id="title-input" value={currentTheme.title} onValueChange={value => currentTheme.title = value}
              css={css`
                border-style: solid;
                border-width: 1px;
              `}
            />
          </WithLabel>
          <ThemeInput
            label="Primary color" currentColor={currentTheme.primary} defaultColor={currentTheme.primary}
            setColor={value => currentTheme.primary = value}
          />
          <ThemeInput
            label="Text color" currentColor={currentTheme.textPrimary} defaultColor={currentTheme.textPrimary}
            setColor={value => currentTheme.textPrimary = value}
          />
          <ThemeInput
            label="Text color 2" currentColor={currentTheme.textSecondary} defaultColor={currentTheme.textSecondary}
            setColor={value => currentTheme.textSecondary = value}
          />
          <ThemeInput
            label="Accent color" currentColor={currentTheme.accent} defaultColor={currentTheme.accent}
            setColor={value => currentTheme.accent = value}
          />
          <ThemeInput
            label="Border color" currentColor={currentTheme.border} defaultColor={currentTheme.border}
            setColor={value => currentTheme.border = value}
          />
          <ThemeInput
            label="Hover color" currentColor={currentTheme.hover} defaultColor={currentTheme.hover}
            setColor={value => currentTheme.hover = value}
          />
          <ThemeInput
            label="Active Color" currentColor={currentTheme.activeItem} defaultColor={currentTheme.activeItem}
            setColor={value => currentTheme.activeItem = value}
          />
        </div>
        <div className="buttons-wrapper">
          <Button value="Delete theme" onClick={() => deleteTheme()}/>
          <Button value="Reset theme" onClick={() => false}/>
          <Button value="Create theme" onClick={() => createTheme()}/>
        </div>
      </div>
    </FocusTrap>
  )

}

export default ThemeManager