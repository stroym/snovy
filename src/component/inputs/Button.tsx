import React, {forwardRef} from "react"
import {css, useTheme} from "@emotion/react"
import {transparentize} from "polished"

export interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
  toggle?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {className, value, defaultValue, ...props}: ButtonProps,
    ref?: React.Ref<HTMLButtonElement>) {

    const theme = useTheme()

    return (
      <button
        ref={ref} {...props} type="button" className={`snovy-button ${className ?? ""}`}
        data-disabled={props.disabled}
        css={css`
          color: ${theme.textPrimary};
          border-color: ${theme.border};

          &:hover {
            background-color: ${transparentize(0.6, theme.textPrimary)};
          }
        `}
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

    return <Button
      {...props} ref={ref} className={`snovy-check-button ${className ?? ""}`} value={toggle ? "✓" : ""}
      css={css`
        ${toggle && `background-color: ${theme.activeItem};`}
        &:hover {
          background-color: ${theme.hover};
        }
      `}
    />
  }
)

interface ColorButtonProps extends ButtonProps {
  color: string | undefined
}

export const ColorButton = forwardRef<HTMLButtonElement, ColorButtonProps>(
  function ColorButton({color, className, ...props}: ColorButtonProps, ref?: React.Ref<HTMLButtonElement>) {

    return <Button
      {...props} ref={ref} className={"snovy-color-button " + className}
      css={color && css`
        background-color: ${color};

        &:hover {
          background-color: ${transparentize(0.6, color)};
        }
      `
      }
    />
  }
)