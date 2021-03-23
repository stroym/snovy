import React, {forwardRef, useContext} from "react"
import OptionsContext from "../../util/OptionsContext"
import {css} from "@emotion/react"
import {lighten, transparentize} from "polished"

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  toggle?: boolean
  invert?: boolean
  tinyColor?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {toggle, invert, className, value, defaultValue, ...props}: ButtonProps,
    ref?: React.Ref<HTMLButtonElement>) {

    const theme = useContext(OptionsContext).theme

    const emotionCss = css`
      color: ${invert ? theme.secondaryTextColor : theme.primaryTextColor};
      border-color: ${invert ? theme.secondaryTextColor : theme.primaryTextColor};

      &:hover {
        background-color: ${transparentize(0.8, invert ? theme.secondaryTextColor : theme.primaryTextColor)};
      }
    `

    return (
      <button
        css={emotionCss} ref={ref} {...props} type="button" className={"snovy-button " + className}
        data-disabled={props.disabled}
      >
        {toggle ? value : defaultValue}
      </button>
    )

  }
)

export const AddButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function AddButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={"snovy-add-button " + className} defaultValue={"+"}/>
  }
)

export const RemoveButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function RemoveButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={"snovy-remove-button " + className} defaultValue={"×"}/>
  }
)

export const CollapseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CollapseButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={"snovy-collapse-button " + className} value={"▲"}
                   defaultValue={"▼"}
    />
  }
)

export const ConfirmButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function ConfirmButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    const theme = useContext(OptionsContext).theme

    const emotionCss = css`
      &:hover {
        background-color: ${theme.hoverColor};
      }
    `

    return <Button css={emotionCss} {...props} ref={ref} className={"snovy-confirm-button " + className}/>
  }
)

export const CheckButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CheckButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    const theme = useContext(OptionsContext).theme

    const emotionCss = css`
      ${props.toggle && `background-color: ${theme.activeColor};`}
      &:hover {
        background-color: ${lighten(0.1, theme.activeColor)};
      }
    `

    return <Button
      css={emotionCss}
      {...props} ref={ref} className={"snovy-check-button " + className} value={"✓"} defaultValue={""}
    />
  }
)

export const ColorButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function ColorButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={"snovy-color-button " + className}/>
  }
)