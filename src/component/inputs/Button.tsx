import React, {forwardRef} from "react"
import {append, concatUnknown, Extras} from "../../util/ComponentUtils"

type buttonRef = React.Ref<HTMLButtonElement>

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  toggle?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props: ButtonProps, ref?: buttonRef) {

    const {toggle, ...rest} = props

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

export const AddButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function AddButton(props: ButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-add-button" defaultValue={"+"}/>
  }
)

export const RemoveButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function RemoveButton(props: ButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-remove-button" defaultValue={"×"}/>
  }
)

export const CollapseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CollapseButton(props: ButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-collapse-button" value={"▲"} defaultValue={"▼"}/>
  }
)

export const ConfirmButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function ConfirmButton(props: ButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-confirm-button"/>
  }
)

export const CheckButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CheckButton(props: ButtonProps, ref?: buttonRef) {
    return <Button
      {...props} ref={ref} className={"snovy-check-button".concat(append(props.toggle, Extras.ACTIVE))}
      value={"✓"} defaultValue={""}
    />
  }
)

export const ColorButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function ColorButton(props: ButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className={concatUnknown("snovy-color-button", props.className)}/>
  }
)

export const OptionsButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function OptionsButton(props: ButtonProps, ref?: buttonRef) {
    return <Button {...props} ref={ref} className="snovy-options-button" defaultValue={"⚙"}/>
  }
)