import React, {forwardRef} from "react"

import {ColorButton} from "./Button"
import {useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import {useColor} from "../../util/Hooks"
import {TinyStyle} from "../tag/TagItem"
import Input from "./Input"

interface ColorPickerProps {
  colors: Array<string>
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
          {props.colors.map((color, index) =>
            <ColorItem key={index} onClick={props.getColor} color={color}/>
          )}
        </div>
        <div className="input-wrapper" onKeyDown={e => useKey(e, keyBindings)}>
          <ColorHelper color={color} text="#"/>
          <Input getText={value => setColor("#" + value)} placeholder="Hex code" maxLength={8}/>
        </div>
      </span>
    )

  }
)

const ColorItem = (props: {
  onClick: (hex: string) => void,
  color: string
}) => {

  return <ColorButton
    className="color-item" onClick={() => {props.onClick(props.color)}} style={{backgroundColor: props.color}}
  />

}

export const ColorHelper = (props: {
  color: string,
  text?: string
}) => {

  const tiny = new TinyStyle(props.color)

  return <span className="color-helper" style={tiny.style}>{props.text}</span>

}

export default ColorPicker