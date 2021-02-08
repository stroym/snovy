import React, {forwardRef} from "react"

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  getText: (text: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const {getText, ...rest} = props

    return (
      <input
        onChange={(e) => getText(e.target.value)}
        ref={ref} {...rest} type="text" className={`snovy-input ${props.className ?? ""}`} autoComplete="off"
      />
    )

  }
)
