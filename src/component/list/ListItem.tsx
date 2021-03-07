import React, {useEffect, useRef, useState} from "react"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {Extras} from "../../util/ComponentUtils"
import Input from "../inputs/Input"

const ListItem = <T extends Record<string, any>>(props: {
  mapped: T,
  active: boolean,
  selected: boolean,
  onClick: (item: T) => void,
  onContext?: (item: T) => void,
  onValueChange?: (str: string) => void
}) => {

  const selfRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState<string>(props.mapped.toString())
  const [editable, , flip] = useHideOnOutsideClick(selfRef, [], !props.onValueChange)

  useEffect(
    () => {
      if (props.active) {
        selfRef.current?.classList.add(Extras.ACTIVE)
      } else {
        selfRef.current?.classList.remove(Extras.ACTIVE)
      }

      if (props.selected) {
        selfRef.current?.classList.add(Extras.SELECTED)
      } else {
        selfRef.current?.classList.remove(Extras.SELECTED)
      }
    }, [props.active, props.selected]
  )

  useEffect(
    () => {
      setValue(props.mapped.toString())
    }, [props.mapped]
  )

  useEffect(
    () => {
      if (props.onValueChange) {
        if (editable) {
          if (selfRef.current) {
            selfRef.current.selectionStart = selfRef.current.selectionEnd = -1
            selfRef.current.classList.add(Extras.EDITABLE)
          }
        } else {
          if (selfRef.current) {
            selfRef.current.classList.remove(Extras.EDITABLE)
            selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
          }
        }
      }
    }, [editable]
  )

  const handleContext = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onContext && props.onContext(props.mapped)
  }

  const handleChange = (text: string) => {
    setValue(text)
    props.onValueChange && props.onValueChange(text)
  }

  const handleFocus = () => {
    if (selfRef.current) {
      selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
    }
  }

  return (
    <Input
      ref={selfRef} className="snovy-list-item" value={value} placeholder={"Title"} readOnly={!editable}
      getText={handleChange} onClick={() => {props.onClick(props.mapped)}} onFocus={handleFocus}
      onDoubleClick={() => props.onValueChange && flip()} onContextMenu={handleContext}
    />
  )

}

export default ListItem