import React, {useEffect, useRef} from "react"
import {CollapseButton} from "../inputs/Button"
import {
  GetInputPropsOptions,
  GetToggleButtonPropsOptions,
  UseComboboxGetInputPropsOptions,
  UseSelectGetToggleButtonPropsOptions
} from "downshift"
import {Extras} from "../../util/ComponentUtils"
import {Key} from "ts-key-enum"

export const ComboBoxInput = (props: {
  getToggleButtonProps: (options?: GetToggleButtonPropsOptions) => UseSelectGetToggleButtonPropsOptions
  comboInput: { getProps: <T>(options?: T) => T & GetInputPropsOptions, options?: UseComboboxGetInputPropsOptions }
}) => {

  const wrapperRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)
      document.addEventListener("keydown", handleKey)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
        document.removeEventListener("keydown", handleKey)
      }
    }, []
  )

  const handleOutsideClick = (e: MouseEvent) => {
    if (!wrapperRef.current?.contains(e.target as Node) &&
      !wrapperRef.current?.parentNode?.contains(e.target as Node)) {
      inputRef.current?.classList.remove(Extras.MOUSE_FOCUS)
    }
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key == Key.Tab) {
      inputRef.current?.classList.remove(Extras.MOUSE_FOCUS)
    }
  }

  return (
    <span
      ref={wrapperRef} className="snovy-combo-box-input-wrapper"
      onMouseDown={() => {inputRef.current?.classList.add(Extras.MOUSE_FOCUS)}}
    >
      <span className="inner-wrapper" {...props.getToggleButtonProps()}>
        <input
          className="snovy-input" type="text" autoComplete="off"
          {...props.comboInput.getProps({ref: inputRef, ...props.comboInput.options})}
        />
        <CollapseButton aria-label={"toggle menu"} tabIndex={0}/>
      </span>
    </span>
  )

}

export default ComboBoxInput