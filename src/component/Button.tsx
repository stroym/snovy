import React, {forwardRef, useRef, useState} from "react"
import {ColorResult, TwitterPicker} from "react-color"
import {Buttons} from "../util/ComponentNames"
import {useHide} from "../util/Hooks"

type buttonRef = React.Ref<HTMLButtonElement>

interface Clickable {
  toggle?: boolean
  onClick?: (e: React.MouseEvent) => void
}

interface ClickableRoot extends Clickable {
  className?: string
  icon?: string
  style?: React.CSSProperties
}

export const Button = forwardRef<HTMLButtonElement, ClickableRoot>(
  function Button(props: ClickableRoot, ref?: buttonRef) {
    return (
      <button
        style={props.style}
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

export const ConfirmButton = forwardRef<HTMLButtonElement, Clickable>(
  function ConfirmButton(props: Clickable, ref?: buttonRef) {
    return <Button ref={ref} className={Buttons.Confirm} onClick={props.onClick} icon={"Add"}/>
  }
)

export const CheckButton = forwardRef<HTMLButtonElement, Clickable>(
  function CheckButton(props: Clickable, ref?: buttonRef) {
    return <Button
      ref={ref} className={Buttons.Check.concat(props.toggle ? " active" : "")} onClick={props.onClick}
      icon={props.toggle ? "✓" : ""}
    />
  }
)

export const ColourButton = (props: {
  getColour: (colour: string) => void,
  defaultColour: string
}) => {

  const selfRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const {visible, flip, position} = useHide(selfRef, [pickerRef])

  const [colour, setColour] = useState(props.defaultColour)

  const getColour = (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) => {
    setColour(color.hex)
    flip()
    props.getColour(colour)
  }

  return (
    <>
      <Button
        ref={selfRef}
        className={Buttons.Colour} onClick={() => flip()}
        style={{backgroundColor: colour}}
      />
      {visible &&
      <div className="colour-wrapper" ref={pickerRef}>
        <TwitterPicker onChangeComplete={getColour} className={"snovy-colour-picker"}/>
      </div>}
    </>
  )

}
