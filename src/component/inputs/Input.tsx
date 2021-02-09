import React, {forwardRef} from "react"
import {concatUnknown} from "../../util/ComponentUtils"

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  getText: (text: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const {getText, ...rest} = props

    return (
      <input
        {...rest} ref={ref} type="text" className={concatUnknown("snovy-input", props.className)}
        autoComplete="off" onChange={(e) => getText(e.target.value)}
      />
    )

  }
)