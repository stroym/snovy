import React, {forwardRef, MutableRefObject, useEffect, useRef, useState} from "react"
import {concatUnknown, Extras} from "../../util/ComponentUtils"
import {useHideOnOutsideClick} from "../../util/Hooks"

interface InputProps extends React.AllHTMLAttributes<HTMLInputElement> {
  onValueChange?: (str: string) => void
}

export const Input = forwardRef((
  {onValueChange, className, ...props}: InputProps,
  ref?: React.Ref<HTMLInputElement>
) => {

  const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

  return (
    <input
      {...props} ref={selfRef}
      type="text"
      className={concatUnknown("snovy-input", className)}
      autoComplete="off" onChange={e => onValueChange && onValueChange(e.target.value)}
    />
  )

})

export const SynchronizedInput = forwardRef((
  {value, onValueChange, ...props}: InputProps,
  ref?: React.Ref<HTMLInputElement>
) => {

  const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

  const [inputValue, setInputValue] = useState(value)
  const [editable, , flip] = useHideOnOutsideClick(selfRef, {initialState: !onValueChange})

  useEffect(
    () => {
      setInputValue(value)
    }, [value]
  )

  useEffect(
    () => {
      if (onValueChange) {
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

  const handleChange = (text: string) => {
    setInputValue(text)
    onValueChange && onValueChange(text)
  }

  return (
    <Input
      ref={selfRef} {...props} onValueChange={handleChange} value={inputValue} readOnly={!editable}
      onDoubleClick={() => onValueChange && flip()}
    />
  )

})

Input.displayName = "Input"
SynchronizedInput.displayName = "SynchronizedInput"

export default Input