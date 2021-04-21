import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react"
import {useHideOnOutsideClick} from "../../util/hooks"
import {ColorHelper} from "./ColorPicker"
import {KeyMapping, useKey} from "../../util/utils"
import {Key} from "ts-key-enum"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (str: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({onValueChange, onChange, className, ...props}: InputProps, ref?: React.Ref<HTMLInputElement>) {

    return (
      <input
        {...props} ref={ref} type="text" className={`snovy-input ${className ?? ""}`} autoComplete="off"
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
      <Input ref={ref} {...props} onValueChange={handleChange} value={inputValue}/>
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

export const ColoredInput = ({onValueChange, value, defaultValue, observe, ...props}: ColoredInputProps) => {

  const defaultColor = defaultValue?.toString() ?? value?.toString() ?? ""

  const [color, setColorState] = useState(value?.toString() ?? "")

  useEffect(
    () => {
      setColor(value?.toString() ?? "")
    }, [value]
  )

  useEffect(
    () => {
      if (observe) {
        getColor()
      }
    }, [color]
  )

  const setColor = (value: string) => {
    const hex = value.includes("#") ? value : "#" + value
    setColorState(hex)
  }

  //TODO check color validity
  const getColor = () => {
    if (color.length > 0) {
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
      <ColorHelper color={color} style={props.style}>
        #
      </ColorHelper>
      <Input
        {...props} className="color-input" value={color.replaceAll("#", "")} onValueChange={setColor}
        placeholder="Hex code" maxLength={8} onKeyDown={e => useKey(e, keyMap)} pattern="[a-f0-9]{6,8}"
      />
    </div>
  )

}

export default Input