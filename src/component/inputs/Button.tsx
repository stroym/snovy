import React, {forwardRef} from "react"
import {append, concatUnknown, Extras} from "../../util/ComponentUtils"

type buttonRef = React.Ref<HTMLButtonElement>

export interface ToggleButtonProps extends React.HTMLProps<HTMLButtonElement> {
  toggle?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function Button(props: ToggleButtonProps, ref?: buttonRef) {

    const {type, toggle, ...rest} = props

    return (
      <button
        ref={ref} {...rest} type="button"
        className={concatUnknown("snovy-button", props.className).concat(append(props.disabled, Extras.DISABLED))}
      >
        {toggle ? props.value : props.defaultValue}
      </button>
    )

  }
)

export const AddButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function AddButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-add-button" defaultValue={"+"}/>
  }
)

export const RemoveButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function RemoveButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-remove-button" defaultValue={"×"}/>
  }
)

export const CollapseButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function CollapseButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-collapse-button" value={"▲"} defaultValue={"▼"}/>
  }
)

export const ConfirmButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ConfirmButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-confirm-button"/>
  }
)

export const CheckButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function CheckButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button
      {...props} ref={ref} className={"snovy-check-button".concat(append(props.toggle, Extras.ACTIVE))}
      value={"✓"} defaultValue={""}
    />
  }
)

export const ColorButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ColorButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-color-button"/>
  }
)

export const OptionsButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function OptionsButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-options-button" defaultValue={"⚙"}/>
  }
)