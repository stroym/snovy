import React, {forwardRef} from "react"
import {Buttons} from "../util/ComponentNames"

type buttonRef = React.Ref<HTMLButtonElement>

interface Clickable {
  toggle?: boolean
  onClick?: (e: React.MouseEvent) => void
}

interface ClickableRoot extends Clickable {
  className?: string
  icon?: string
}

const Button = forwardRef<HTMLButtonElement, ClickableRoot>(
  function Button(props: ClickableRoot, ref?: buttonRef) {
    return (
      <button
        ref={ref} type="button" className={Buttons.Button.concat(props.className ? ` ${props.className}` : "")}
        onClick={(e) => props.onClick != undefined ? props.onClick(e) : null}
      >
        {props.icon}
      </button>
    )
  }
)

export const AddButton = forwardRef<HTMLButtonElement, Clickable>(
  function AddButton(props: Clickable, ref?: buttonRef) {
    return <Button ref={ref} className={Buttons.Add} onClick={props.onClick} icon={"+"}/>
  }
)

export const RemoveButton = forwardRef<HTMLButtonElement, Clickable>(
  function RemoveButton(props: Clickable, ref?: buttonRef) {
    return <Button ref={ref} className={Buttons.Remove} onClick={props.onClick} icon={"×"}/>
  }
)

export const CollapseButton = forwardRef<HTMLButtonElement, Clickable>(
  function CollapseButton(props: Clickable, ref?: buttonRef) {
    return <Button ref={ref} className={Buttons.Collapse} onClick={props.onClick} icon={props.toggle ? "▲" : "▼"}/>
  }
)

export const ColourButton = forwardRef<HTMLButtonElement, Clickable>(
  function ColourButton(props: Clickable, ref?: buttonRef) {
    return (
      <>
        <Button ref={ref} className={Buttons.Colour} onClick={props.onClick}/>
        {/*<TwitterPicker/>*/}
      </>
    )
  }
)