import React, {useContext, useRef} from "react"

import {ColorButton} from "./Button"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {TinyStyle} from "../tag/TagItem"
import {ColoredInput} from "./Input"
import FocusTrap from "focus-trap-react"
import OptionsContext from "../../util/OptionsContext"

export const ColorPicker = (props: {
  colors: Array<string>
  selectedItem: string | undefined
  getColor: (hex: string) => void
  getColorFromInput: (hex: string) => void
}) => {

  const theme = useContext(OptionsContext).theme

  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(buttonRef, {otherRefs: [pickerRef], eventType: "click"})

  const getColor = (color: string) => {
    props.getColor(color)
    flip()
  }

  //TODO make button optional
  return (
    <>
      <ColorButton ref={buttonRef} className="color-picker-button" onClick={() => {flip()}} color={props.selectedItem}/>
      {visible &&
      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
        <span ref={pickerRef} className="snovy-color-picker">
          <div className="color-container">
            {props.colors.map((color, index) =>
              <ColorItem key={index} onClick={getColor} color={color}/>
            )}
          </div>
          <ColoredInput onValueChange={getColor} style={{borderColor: theme.textPrimary}}/>
        </span>
      </FocusTrap>
      }
    </>
  )

}

const ColorItem = (props: {
  onClick: (hex: string) => void,
  color: string
}) => {

  return <ColorButton className="color-item" onClick={() => {props.onClick(props.color)}} color={props.color}/>

}

export const ColorHelper = (props: {
  color: string
  text?: string
  style?: React.CSSProperties
}) => {

  const tiny = new TinyStyle(props.color)

  return <span className="color-helper" style={{...props.style, ...tiny.style}}>{props.text}</span>

}

export default ColorPicker