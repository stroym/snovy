import React, {forwardRef} from "react"

import {ColourButton} from "./Button"
import {Input} from "./Input"

interface ColourPickerProps {
  getColour: (hex: string) => void,
  getInputColour: (hex: string) => void
}

export const ColourPicker = forwardRef<HTMLSpanElement, ColourPickerProps>(
  function ColourPicker(props: ColourPickerProps, ref?: React.Ref<HTMLSpanElement>) {

    return (
      <span ref={ref} className="snovy-colour-picker">
        <span className="colour-container">
          <ColourItem onClick={props.getColour} colour="#ff0000"/>
          <ColourItem onClick={props.getColour} colour="#ffa500"/>
          <ColourItem onClick={props.getColour} colour="#00ff00"/>
          <ColourItem onClick={props.getColour} colour="#40e0d0"/>
          <ColourItem onClick={props.getColour} colour="#0000ff"/>
          <ColourItem onClick={props.getColour} colour="#800080"/>
          <ColourItem onClick={props.getColour} colour="#ffffff"/>
          <ColourItem onClick={props.getColour} colour="#000000"/>
          <Input getText={props.getInputColour} defaultValue="#" placeholder="Hex code"/>
        </span>
      </span>
    )
  }
)

const ColourItem = (props: {
  onClick: (hex: string) => void,
  colour: string
}) => {

  return <ColourButton onClick={() => {props.onClick(props.colour)}} style={{backgroundColor: props.colour}}/>

}

export default ColourPicker