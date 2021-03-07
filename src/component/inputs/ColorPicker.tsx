import React, {forwardRef} from "react"

import {ColorButton} from "./Button"
import {useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import {useColor} from "../../util/Hooks"
import {TinyStyle} from "../tag/TagItem"
import Input from "./Input"

interface ColorPickerProps {
  getColor: (hex: string) => void,
  getColorFromInput: (hex: string) => void
}

export const ColorPicker = forwardRef((props: ColorPickerProps, ref?: React.Ref<HTMLSpanElement>) => {

  const [color, setColor] = useColor("")

    const keyBindings = [
      {
        key: Key.Enter,
        handler: () => {props.getColor(color)}
      }
    ]

    return (
      <span ref={ref} className="snovy-color-picker">
        <div className="color-container">
          <ColorItem onClick={props.getColor} color="#ff0000"/>
          <ColorItem onClick={props.getColor} color="#ffa500"/>
          <ColorItem onClick={props.getColor} color="#00ff00"/>
          <ColorItem onClick={props.getColor} color="#40e0d0"/>
          <ColorItem onClick={props.getColor} color="#0000ff"/>
          <ColorItem onClick={props.getColor} color="#800080"/>
          <ColorItem onClick={props.getColor} color="#ffffff"/>
          <ColorItem onClick={props.getColor} color="#000000"/>
        </div>
        <div className="input-wrapper" onKeyDown={e => useKey(e, keyBindings)}>
          <span className="color-helper">#</span>
          <Input getText={value => setColor("#" + value)} placeholder="Hex code" maxLength={8}/>
          <ColorHelper color={color}/>
        </div>
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

export const ColorHelper = (props: {
  color: string,
  text?: string
}) => {

  const tiny = new TinyStyle(props.color)

  return <span className="color-helper" style={tiny.style}>{props.text}</span>

}

export default ColorPicker