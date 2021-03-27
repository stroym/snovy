import React, {forwardRef} from "react"
import {css, useTheme} from "@emotion/react"
import {lighten, transparentize} from "polished"

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  toggle?: boolean
  invert?: boolean
  tinyColor?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {invert, className, value, defaultValue, ...props}: ButtonProps,
    ref?: React.Ref<HTMLButtonElement>) {

    const theme = useTheme()

    const emotionCss = css`
      color: ${invert ? theme.textSecondary : theme.textPrimary};
      border-color: ${invert ? theme.textSecondary : theme.textPrimary};

      &:hover {
        background-color: ${transparentize(0.6, invert ? theme.textSecondary : theme.textPrimary)};
      }
    `

    return (
      <button
        css={emotionCss} ref={ref} {...props} type="button" className={`snovy-button ${className ?? ""}`}
        data-disabled={props.disabled}
      >
        {value || defaultValue}
      </button>
    )

  }
)

export const AddButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function AddButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={`snovy-add-button ${className ?? ""}`} value={"+"}/>
  }
)

export const RemoveButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function RemoveButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={`snovy-remove-button ${className ?? ""}`} value={"×"}/>
  }
)

export const CollapseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CollapseButton({toggle, className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {
    return <Button {...props} ref={ref} className={`snovy-collapse-button ${className ?? ""}`}
                   value={toggle ? "▲" : "▼"}
    />
  }
)

export const TextButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function TextButton({className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    const theme = useTheme()

    const emotionCss = css`
      &:hover {
        background-color: ${theme.hover};
      }
    `

    return <Button css={emotionCss} {...props} ref={ref} className={`snovy-text-button ${className ?? ""}`}/>
  }
)

export const CheckButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function CheckButton({toggle, className, ...props}: ButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    const theme = useTheme()

    const emotionCss = css`
      ${toggle && `background-color: ${theme.activeItem};`}
      &:hover {
        background-color: ${lighten(0.1, theme.activeItem)};
      }
    `

    return <Button
      css={emotionCss} {...props} ref={ref} className={`snovy-check-button ${className ?? ""}`}
      value={toggle ? "✓" : ""}
    />
  }
)

interface ColorButtonProps extends ButtonProps {
  color: string | undefined
}

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
  function ColorButton({color, className, ...props}: ColorButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    const theme = useTheme()

    const emotionCss = color && css`
      background-color: ${color};

      &:hover {
        border-color: ${props.invert ? theme.textPrimary : theme.textSecondary};
        background-color: ${transparentize(0.6, color)};
      }
    `

    return <Button css={emotionCss} {...props} ref={ref} className={"snovy-color-button " + className}/>
  }
)