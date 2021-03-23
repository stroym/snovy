import React, {forwardRef, MutableRefObject, useContext, useEffect, useRef, useState} from "react"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {ColorHelper} from "./ColorPicker"
import {KeyMapping, useKey} from "../../util/Utils"
import {Key} from "ts-key-enum"
import OptionsContext from "../../util/OptionsContext"

export interface InputProps extends React.AllHTMLAttributes<HTMLInputElement> {
  onValueChange?: (str: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({onValueChange, onChange, className, style, ...props}: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

    const theme = useContext(OptionsContext).theme

    return (
      <input
        style={{color: theme.primaryTextColor, ...style}}
        {...props} ref={selfRef} type="text" className={"snovy-input " + className} autoComplete="off"
        onChange={e => {
          onChange && onChange(e)
          onValueChange && onValueChange(e.target.value)
        }}
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
            }
          } else {
            if (selfRef.current) {
              selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
            }
          }
        }
      }, [editable]
    )

    return (
      <SynchronizedInput
        data-editable={editable}
        ref={selfRef} {...props} readOnly={!editable} onDoubleClick={() => props.onValueChange && flip()}
      />
    )

  }
)

export interface ColoredInputProps extends InputProps {
  onValueChange: (str: string) => void
  observe?: boolean
}

export const ColoredInput = ({onValueChange, value, observe, ...props}: ColoredInputProps) => {

  const defaultColor = value?.toString() ?? ""

  const selfRef = useRef<HTMLInputElement>(null)

  const [color, setColorState] = useState(defaultColor)

  const setColor = (value: string) => {
    const hex = value.includes("#") ? value : "#" + value
    setColorState(hex)

    if (observe) {
      onValueChange(hex)
    }
  }

  const getColor = () => {
    if (color.length > 1) {
      onValueChange(color)
    } else {
      setColor(defaultColor)
      onValueChange(defaultColor)
    }
  }

  const keyMap: Array<KeyMapping> = [
    {key: Key.Enter, handler: getColor},
    {key: Key.Backspace, handler: () => setColor(defaultColor), condition: color.replaceAll("#", "").length == 0}
  ]

  return (
    <div className="colored-input-wrapper">
      <ColorHelper color={color} text="#" style={props.style}/>
      <Input
        {...props} ref={selfRef} value={color.replaceAll("#", "")} onValueChange={setColor}
        placeholder="Hex code" maxLength={8} onKeyDown={e => useKey(e, keyMap)}
      />
    </div>
  )

}

export default Input