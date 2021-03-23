import React from "react"
import {CollapseButton} from "../inputs/Button"
import {GetInputPropsOptions, GetToggleButtonPropsOptions, UseSelectGetToggleButtonPropsOptions} from "downshift"
import Input from "../inputs/Input"

export const ComboBoxInput = (props: {
  getToggleButtonProps: (options?: GetToggleButtonPropsOptions) => UseSelectGetToggleButtonPropsOptions
  getInputProps: <T>(options?: T) => T & GetInputPropsOptions
  style?: React.CSSProperties
}) => {

  return (
    <span style={props.style} className="snovy-combo-box-input-wrapper" {...props.getToggleButtonProps}>
      <Input {...props.getInputProps}/>
      <CollapseButton aria-label={"toggle menu"} tabIndex={0}/>
    </span>
  )

}

export default ComboBoxInput