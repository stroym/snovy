import React, {forwardRef} from "react"
import {Buttons} from "../../util/ComponentNames"

type buttonRef = React.Ref<HTMLButtonElement>

interface ToggleButtonProps extends React.HTMLProps<HTMLButtonElement> {
  toggle?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function Button(props: ToggleButtonProps, ref?: buttonRef) {

    const {type, toggle, ...rest} = props

    return (
      <button ref={ref} {...rest} type="button" className={Buttons.Button + ` ${props.className ?? ""}`}>
        {toggle ? props.value : props.defaultValue}
      </button>
    )

  }
)

export const AddButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function AddButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className={Buttons.Add} defaultValue={"+"}/>
  }
)

export const RemoveButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function RemoveButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className={Buttons.Remove} defaultValue={"×"}/>
  }
)

export const CollapseButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function CollapseButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className={Buttons.Collapse} value={"▲"} defaultValue={"▼"}/>
  }
)

export const ConfirmButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ConfirmButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className={Buttons.Confirm} defaultValue={"Add"}/>
  }
)

export const CheckButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function CheckButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button
      {...props} ref={ref} className={Buttons.Check.concat(props.toggle ? " active" : "")} value={"✓"} defaultValue={""}
    />
  }
)

export const ColourButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  function ColourButton(props: ToggleButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className={Buttons.Colour}/>
  }
)