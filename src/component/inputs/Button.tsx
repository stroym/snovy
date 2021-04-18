import React, {forwardRef, useEffect, useState} from "react"
import {css} from "@emotion/react"
import {transparentize} from "polished"
import {arrows} from "../../util/values"
import {cls} from "../../util/Utils"

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

    return (
      <button
        ref={ref} {...props} type="button" data-disabled={props.disabled}
        className={"snovy-button styled-hover".concat(
          cls("snovy-button-circular", circular ?? false),
          cls("mono", mono ?? false),
          cls(className)
        )}
      >
        {!preset ? children || value || defaultValue : preset == "remove" && "×"}
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
    {onClick, className, getState, setState, value, defaultValue, preset, ...props}: ToggleButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) {

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
      {...props} ref={ref} className={`${toggled ? "active-item" : ""} ${className ?? ""}`}
      onClick={handleClick} circular
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