import React, {useEffect, useState} from "react"
import Input from "../inputs/Input"
import {builtinThemes, Theme} from "../../data/model/options/Theme"
import ComboBox from "../combo_box/ComboBox"
import ThemeInput from "./ThemeInput"
import {css} from "@emotion/react"
import WithLabel from "../inputs/WithLabel"

interface ThemeProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeManager = ({theme, setTheme, ...props}: ThemeProps) => {

  const [current, setCurrent] = useState(theme)

  useEffect(
    () => {
      console.log(theme.toString())
      setCurrent(theme)
    }, [theme]
  )

  return (
    <div
      id="theme-options" className="snovy-options-container"
      css={css`
        .label-text,
        #title-input,
        .colored-input-wrapper {
          width: 50%;
        }

        .color-input {
          width: 100%;
        }`
      }
    >
      <ComboBox
        items={builtinThemes} selectedItem={current}
        onItemSelect={value => value ? setTheme(value) : setTheme(builtinThemes.first()!)}
        options={{selectPreviousOnEsc: true}}
      />
      <WithLabel value="Theme name" position="before">
        <Input
          id="title-input"
          value={theme.title} onValueChange={value => theme.title = value}
          css={css`
            border-style: solid !important;
            border-width: 1px;
          `}
        />
      </WithLabel>
      <ThemeInput
        label="Primary color" currentColor={theme.primary} defaultColor={theme.primary}
        setColor={value => theme.primary = value}
      />
      <ThemeInput
        label="Secondary color" currentColor={theme.secondary} defaultColor={theme.secondary}
        setColor={value => theme.secondary = value}
      />
      <ThemeInput
        label="Text color" currentColor={theme.textPrimary} defaultColor={theme.textPrimary}
        setColor={value => theme.textPrimary = value}
      />
      <ThemeInput
        label="Text color 2" currentColor={theme.textSecondary} defaultColor={theme.textSecondary}
        setColor={value => theme.textSecondary = value}
      />
      <ThemeInput
        label="Accent color" currentColor={theme.accent} defaultColor={theme.accent}
        setColor={value => theme.accent = value}
      />
      <ThemeInput
        label="Border color" currentColor={theme.border} defaultColor={theme.border}
        setColor={value => theme.border = value}
      />
      <ThemeInput
        label="Hover color" currentColor={theme.hover} defaultColor={theme.hover}
        setColor={value => theme.hover = value}
      />
      <ThemeInput
        label="Active Color" currentColor={theme.activeItem} defaultColor={theme.activeItem}
        setColor={value => theme.activeItem = value}
      />
    </div>
  )

}

export default ThemeManager