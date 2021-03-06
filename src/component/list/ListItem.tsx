import React, {useEffect, useRef, useState} from "react"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {Input} from "../inputs/Input"
import {append, Extras} from "../../util/ComponentUtils"

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

  const makeClassName = () => {
    return "snovy-list-item".concat(
      append(props.active, Extras.ACTIVE),
      append(props.selected, Extras.SELECTED)
    )
  }

  return (
    <Input
      ref={selfRef} className={makeClassName()} value={value} placeholder={"Title"} readOnly={!editable}
      getText={handleChange} onClick={() => {props.onClick(props.mapped)}}
      onDoubleClick={() => props.onValueChange && flip()} onContextMenu={handleContext}
    />
  )

}

export default ListItem