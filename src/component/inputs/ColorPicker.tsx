import React, {useRef} from "react"

import {ColorButton} from "./Button"
import {watchOutsideClick} from "../../util/hooks"
import {TinyStyle} from "../tag/TagItem"
import {ColoredInput} from "./Input"
import FocusTrap from "focus-trap-react"

export const ColorPicker = (props: {
  colors: Array<string>
  selectedItem: string | undefined
  getColor: (hex: string) => void
  getColorFromInput: (hex: string) => void
  includeButton?: boolean
}) => {

  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , toggle] = watchOutsideClick(buttonRef, {otherRefs: [pickerRef], eventType: "click"})

  const getColor = (color: string) => {
    props.getColor(color)
    toggle()
  }

  return (
    <>
      {
        props.includeButton &&
        <ColorButton
          ref={buttonRef} className="color-picker-button" mono onClick={() => {toggle()}} color={props.selectedItem}
        />
      }
      {
        visible &&
        <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
        <span ref={pickerRef} className="snovy-color-picker">
          <div className="color-container">
            {props.colors.map((color, index) =>
              <ColorItem key={index} onClick={getColor} color={color}/>
            )}
          </div>
          <ColoredInput onValueChange={getColor}/>
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

export interface ColorHelperProps extends React.HTMLProps<HTMLSpanElement> {
  color: string
}

export const ColorHelper = ({color, children, style}: ColorHelperProps) => {

  const tiny = new TinyStyle(color)

  return <span className="color-helper" style={{...tiny.style, ...style}}>{children}</span>

}

export default ColorPicker