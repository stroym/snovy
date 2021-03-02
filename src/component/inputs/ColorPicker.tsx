import React, {forwardRef} from "react"

import {ColorButton} from "./Button"
import {Input} from "./Input"

interface ColorPickerProps {
  getColor: (hex: string) => void,
  getInputColor: (hex: string) => void
}

export const ColorPicker = forwardRef<HTMLSpanElement, ColorPickerProps>(
  function ColorPicker(props: ColorPickerProps, ref?: React.Ref<HTMLSpanElement>) {

    return (
      <span ref={ref} className="snovy-color-picker">
        <span className="color-container">
          <ColorItem onClick={props.getColor} color="#ff0000"/>
          <ColorItem onClick={props.getColor} color="#ffa500"/>
          <ColorItem onClick={props.getColor} color="#00ff00"/>
          <ColorItem onClick={props.getColor} color="#40e0d0"/>
          <ColorItem onClick={props.getColor} color="#0000ff"/>
          <ColorItem onClick={props.getColor} color="#800080"/>
          <ColorItem onClick={props.getColor} color="#ffffff"/>
          <ColorItem onClick={props.getColor} color="#000000"/>
          <span className="input-wrapper">
            <div>#</div>
            <Input getText={value => props.getInputColor("#" + value)} placeholder="Hex code" maxLength={8}/>
          </span>
        </span>
      </span>
    )
  }
)

const ColorItem = (props: {
  onClick: (hex: string) => void,
  color: string
}) => {

  return <ColorButton onClick={() => {props.onClick(props.color)}} style={{backgroundColor: props.color}}/>

}

export default ColorPicker