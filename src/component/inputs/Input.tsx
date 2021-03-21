import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react"
import {concatUnknown, Extras} from "../../util/ComponentUtils"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {ColorHelper} from "./ColorPicker"
import {KeyMapping, useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"

export interface InputProps extends React.AllHTMLAttributes<HTMLInputElement> {
  onValueChange?: (str: string) => void
  value?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({onValueChange, className, ...props}: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

    return (
      <input
        {...props} ref={selfRef} type="text" className={concatUnknown("snovy-input", className)}
        autoComplete="off" onChange={e => onValueChange && onValueChange(e.target.value)}
      />
    )

  }
)

export const SynchronizedInput = forwardRef<HTMLInputElement, InputProps>(
  function SynchronizedInput({value, onValueChange, ...props}: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

    const [inputValue, setInputValue] = useState(value)

    useEffect(
      () => {
        setInputValue(value)
      }, [value]
    )

    const handleChange = (text: string) => {
      setInputValue(text)
      onValueChange && onValueChange(text)
    }

    return (
      <Input ref={selfRef} {...props} onValueChange={handleChange} value={inputValue}/>
    )

  }
)

export const EditableInput = forwardRef<HTMLInputElement, InputProps>(
  function EditableInput(props: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)
    const [editable, , flip] = useHideOnOutsideClick(selfRef, {initialState: !props.onValueChange})

    useEffect(
      () => {
        if (props.onValueChange) {
          if (editable) {
            if (selfRef.current) {
              selfRef.current.selectionStart = selfRef.current.selectionEnd = -1
              selfRef.current.classList.add(Extras.EDITABLE)
            }
          } else {
            if (selfRef.current) {
              selfRef.current.classList.remove(Extras.EDITABLE)
              selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
            }
          }
        }
      }, [editable]
    )

    return (
      <SynchronizedInput
        ref={selfRef} {...props} readOnly={!editable} onDoubleClick={() => props.onValueChange && flip()}
      />
    )

  }
)

export const ColoredInput = ({onValueChange, value, ...props}: InputProps) => {

  const defaultColor = value ?? ""

  const selfRef = useRef<HTMLInputElement>(null)

  const [color, setColorState] = useState(defaultColor)

  const setColor = (hex: string) => {
    if (hex.includes("#")) {
      setColorState(hex)
    } else {
      setColorState("#" + hex)
    }
  }

  const getColor = () => {
    if (onValueChange) {
      if (color.length > 1) {
        onValueChange(color)
      } else {
        setColor(defaultColor)
        onValueChange(defaultColor)
      }
    }
  }

  const keyMap: Array<KeyMapping> = [
    {key: Key.Enter, handler: getColor},
    {key: Key.Backspace, handler: () => setColor(defaultColor), condition: color.replaceAll("#", "").length == 0}
  ]

  return (
    <div className="colored-input-wrapper">
      <ColorHelper color={color} text="#"/>
      <Input
        {...props} ref={selfRef} value={color.replaceAll("#", "")} onValueChange={setColor}
        placeholder="Hex code" maxLength={8} onKeyDown={e => useKey(e, keyMap)}
      />
    </div>
  )

}

export default Input