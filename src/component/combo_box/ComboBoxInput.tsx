import React, {useRef} from "react"
import {CollapseButton} from "../inputs/Button"
import {
  GetInputPropsOptions,
  GetToggleButtonPropsOptions,
  UseComboboxGetInputPropsOptions,
  UseSelectGetToggleButtonPropsOptions
} from "downshift"

export const ComboBoxInput = (props: {
  getToggleButtonProps: (options?: GetToggleButtonPropsOptions) => UseSelectGetToggleButtonPropsOptions
  comboInput: { getProps: <T>(options?: T) => T & GetInputPropsOptions, options?: UseComboboxGetInputPropsOptions }
}) => {

  const wrapperRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <span ref={wrapperRef} className="snovy-combo-box-input-wrapper">
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