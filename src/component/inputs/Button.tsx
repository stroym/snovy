import React, {forwardRef, useEffect} from "react"
import {css} from "@emotion/react"
import {cls} from "../../util/utils"

import {default as AddIcon} from "../../../public/icons/add.svg"
import {default as CollapsedIcon} from "../../../public/icons/expanded.svg"
import {default as ExpandedIcon} from "../../../public/icons/collapsed.svg"
import {default as CollapsedCircledIcon} from "../../../public/icons/expanded_circled.svg"
import {default as ExpandedCircledIcon} from "../../../public/icons/collapsed_circled.svg"
import {default as CheckIcon} from "../../../public/icons/checked.svg"
import {default as RemoveIcon} from "../../../public/icons/remove.svg"
import {activeItem} from "../../util/classes"
import {useToggle} from "../../util/hooks"

type BasePresets = "remove"

type TogglePresets = "add" | "collapse" | "collapse_simple" | "check" | "provided"

//TODO add tooltip
export interface ButtonProps<T extends BasePresets | TogglePresets> extends React.HTMLProps<HTMLButtonElement> {
  preset?: T
  mono?: boolean
  circular?: boolean
  toggled?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps<BasePresets | TogglePresets>>(
  function Button(
    {
      className,
      children,
      value,
      defaultValue,
      preset,
      mono,
      circular,
      toggled,
      ...props
    }: ButtonProps<BasePresets | TogglePresets>,
    ref?: React.Ref<HTMLButtonElement>
  ) {

    function resolvePreset() {
      switch (preset) {
        case "add":
          return <AddIcon/>
        case "collapse":
          return toggled ? <CollapsedCircledIcon/> : <ExpandedCircledIcon/>
        case "collapse_simple":
          return toggled ? <CollapsedIcon/> : <ExpandedIcon/>
        case "check":
          return toggled ? <CheckIcon/> : ""
        case "remove":
          return <RemoveIcon/>
        default:
          return children
      }
    }

    return (
      <button
        ref={ref} {...props} type="button" data-disabled={props.disabled}
        className={"snovy-button styled-hover".concat(
          cls("snovy-button-circular", circular ?? false),
          cls("mono", mono ?? false),
          cls("svg-button " + preset, preset != undefined),
          cls(activeItem, toggled == true),
          cls(className)
        )}
        css={css`
          color: inherit;

          &:hover svg {
            opacity: 0.5;
          }
        `}
      >
        {preset ? resolvePreset() : value || defaultValue || children}
      </button>
    )

  }
)

export interface ToggleButtonProps extends ButtonProps<TogglePresets> {
  getState?: (toggled: boolean) => void
  setState?: boolean
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ToggleButton(
    {onClick, getState, setState, ...props}: ToggleButtonProps,
    ref?: React.Ref<HTMLButtonElement>
  ) {

    const [toggled, setToggled, toggle] = useToggle()

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
      toggle()
    }

    return <Button {...props} ref={ref} toggled={toggled} onClick={handleClick}/>
  }
)

interface ColorButtonProps extends ButtonProps<BasePresets> {
  color: string | undefined
}

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
  function ColorButton({color, className, ...props}: ColorButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    return <Button
      {...props} ref={ref} className={`snovy-color-button ${className ?? ""}`} circular
      style={{backgroundColor: color, color: color}}
    />
  }
)