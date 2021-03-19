import React, {useRef} from "react"

import {ColorButton} from "./Button"
import {KeyMapping, useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import {useColor, useHideOnOutsideClick} from "../../util/Hooks"
import {TinyStyle} from "../tag/TagItem"
import Input from "./Input"
import FocusTrap from "focus-trap-react"

export const ColorPicker = (props: {
  colors: Array<string>
  selectedColor: string
  getColor: (hex: string) => void
  getColorFromInput: (hex: string) => void
}) => {

  const buttonRef = useRef<HTMLButtonElement>(null)
  const pickerRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(buttonRef, {otherRefs: [pickerRef], eventType: "click"})

  const [inputValue, setInputValue] = useColor("")

  const keyMap: Array<KeyMapping> = [
    {key: Key.Enter, handler: () => getColor(inputValue)}
  ]

  const getColor = (color: string) => {
    props.getColor(color)
    flip()
  }

  //TODO make button optional
  return (
    <>
      <ColorButton
        ref={buttonRef} className="color-picker-button" onClick={() => {flip()}}
        style={{backgroundColor: props.selectedColor}} tabIndex={0}
      />
      {visible &&
      <FocusTrap focusTrapOptions={{clickOutsideDeactivates: true}}>
        <span ref={pickerRef} className="snovy-color-picker" tabIndex={-1}>
        <div className="color-container">
          {props.colors.map((color, index) =>
            <ColorItem key={index} onClick={getColor} color={color}/>
          )}
        </div>
        <div className="input-wrapper" onKeyDown={e => useKey(e, keyMap)}>
          <ColorHelper color={inputValue} text="#"/>
          <Input onValueChange={value => setInputValue("#" + value)} placeholder="Hex code" maxLength={8}/>
        </div>
      </span>
      </FocusTrap>
      }
    </>
  )

}

const ColorItem = (props:
                     {
                       onClick: (hex: string) => void,
                       color
                         :
                         string
                     }
) => {

  return <ColorButton
    className="color-item" onClick={() => {props.onClick(props.color)}} style={{backgroundColor: props.color}}
  />

}

export const ColorHelper = (props:
                              {
                                color: string,
                                text?: string
                              }
) => {

  const tiny = new TinyStyle(props.color)

  return <span className="color-helper" style={tiny.style}>{props.text}</span>

}

export default ColorPicker