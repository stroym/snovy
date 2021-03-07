import React, {forwardRef, MutableRefObject, useRef} from "react"
import {concatUnknown, Extras} from "../../util/ComponentUtils"

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  getText?: (text: string) => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props: InputProps, ref?: React.Ref<HTMLInputElement>) {

    const {getText, ...rest} = props

    const selfRef = ref ? (ref as MutableRefObject<HTMLInputElement>) : useRef<HTMLInputElement>(null)

    return (
      <input
        {...rest} ref={selfRef}
        type="text"
        className={concatUnknown("snovy-input", props.className)}
        autoComplete="off" onChange={e => getText && getText(e.target.value)}
        onMouseDown={() => {selfRef.current?.classList.add(Extras.MOUSE_FOCUS)}}
        onBlur={() => selfRef.current?.classList.remove(Extras.MOUSE_FOCUS)}
      />
    )

  }
)

export default Input