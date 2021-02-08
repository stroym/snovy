import React, {useEffect, useRef, useState} from "react"
import {IdentifiedItem, Item} from "../../model/common/Base"
import {useHideOnOutsideClick} from "../../util/Hooks"
import {Input} from "../inputs/Input"
import {append, Extras} from "../../util/ComponentNames"

const ListItem = <T extends IdentifiedItem | Item>(props: {
  mapped: T,
  active: boolean,
  activeContext: boolean,
  onClick: (item: T) => void,
  onContext: (item: T) => void
}) => {

  const selfRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState<string>("")
  const [editable, , flip] = useHideOnOutsideClick(selfRef)

  useEffect(
    () => {
      setValue(props.mapped.name)
    }, [props.mapped, props.mapped.name]
  )

  useEffect(
    () => {
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
    }, [editable]
  )

  const handleContext = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onContext(props.mapped)
  }

  const handleChange = (text: string) => {
    setValue(text)
    props.mapped.name = text
  }

  const makeClassName = () => {
    return "snovy-list-item".concat(append(props.active, Extras.ACTIVE), append(props.activeContext, Extras.CONTEXT))
  }

  return (
    <Input
      ref={selfRef} className={makeClassName()} value={value} placeholder={"Name..."} readOnly={!editable}
      getText={handleChange} onClick={() => {props.onClick(props.mapped)}} onDoubleClick={flip}
      onContextMenu={handleContext}
    />
  )

}

export default ListItem