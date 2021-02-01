import React, {ChangeEvent, useEffect, useRef, useState} from "react"
import {IdentifiedItem, Item} from "../../model/common/Base"
import {useOutsideClick} from "../../Hooks"

const ListItem = <T extends IdentifiedItem | Item>(props: {
  mapped: T,
  active: boolean,
  activeContext: boolean,
  onClick: (item: T) => any,
  onContext: (item: T) => any
}) => {

  const selfRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState<string>("")
  const [editable, setEditable] = useOutsideClick(selfRef)

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
          selfRef.current.classList.add("editable")
        }
      } else {
        if (selfRef.current) {
          selfRef.current.classList.remove("editable")
          selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
        }
      }
    }, [editable]
  )

  const handleContext = (e: React.MouseEvent) => {
    e.stopPropagation()
    props.onContext(props.mapped)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    props.mapped.name = e.target.value
  }

  const makeClassName = () => {
    return "snovy-list-item".concat(props.active ? " active " : "", props.activeContext ? " active-context " : "")
  }

  return (
    <input className={makeClassName()} ref={selfRef} type="text" value={value} placeholder={"Name..."}
           onChange={handleChange} readOnly={!editable}
           onClick={() => {props.onClick(props.mapped)}}
           onDoubleClick={() => {setEditable(true)}}
           onContextMenu={handleContext}
    />
  )

}

export default ListItem