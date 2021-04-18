import React, {forwardRef, useEffect, useState} from "react"
import {css, useTheme} from "@emotion/react"
import {transparentize} from "polished"
import {arrows} from "../../util/values"

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  mono?: boolean
  preset?: "add" | "collapse" | "check" | "remove"
  circular?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {className, value, defaultValue, children, mono, preset, circular, ...props}: ButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) {

    const theme = useTheme()

    return (
      <button
        ref={ref} {...props} type="button"
        className={`snovy-button ${circular ? "snovy-button-circular" : ""} ${className ?? ""}`}
        data-disabled={props.disabled}
        css={css`
          color: ${theme.textPrimary};
          border-color: ${theme.border};

          &:hover {
            background-color: ${mono ? transparentize(0.6, theme.textPrimary) : theme.hover};
          }
        `}
      >
        {
          !preset ? children || value || defaultValue :
            preset == "remove" && "×"
        }
      </button>
    )

  }
)

export interface ToggleButtonProps extends ButtonProps {
  getState?: (toggled: boolean) => void
  setState?: boolean
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {onClick, getState, setState, value, defaultValue, preset, ...props}: ToggleButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) {

    const theme = useTheme()

    const [toggled, setToggled] = useState(setState ?? false)

    useEffect(
      () => {
        if (setState != undefined) {
          setToggled(setState)
        }
      }, [setState]
    )

    const handleClick = (e) => {
      onClick && onClick(e)
      getState && getState(!toggled)
      setToggled(!toggled)
    }

    function resolvePreset() {
      switch (preset) {
        case "add":
          return "+"
        case "collapse":
          return toggled ? arrows.UP : arrows.DOWN
        case "check":
          return toggled ? "✓" : ""
      }
    }

    return <Button
      {...props} ref={ref} onClick={handleClick} circular
      css={css`
        ${!props.mono && toggled && `background-color: ${theme.activeItem};`}
      `}
    >
      {preset ? resolvePreset() : toggled ? value : defaultValue}
    </Button>
  }
)

interface ColorButtonProps extends ButtonProps {
  color: string | undefined
}

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
  function ColorButton({color, className, ...props}: ColorButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    return <Button
      {...props} ref={ref} className={`snovy-color-button ${className ?? ""}`} circular
      css={color && css`
        background-color: ${color};

        &:hover {
          background-color: ${transparentize(0.6, color)};
        }
      `
      }
    />
  }
)