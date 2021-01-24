import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from "react"
import {Item} from "../../model/Base"

const ListItem = <T extends Item>(props: {
  mapped: T,
  active: boolean,
  activeContext: boolean,
  onClick: (item: T) => any,
  onContext: (item: T) => any
}) => {

  const selfRef = useRef<HTMLInputElement>(null)

  const [value, setValue] = useState<string>("")
  const [editable, setEditable] = useState<boolean>(false)

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
      }
    }, []
  )

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

  const handleContext = (event: React.MouseEvent) => {
    event.stopPropagation()
    props.onContext(props.mapped)
  }

  const handleOutsideClick = useCallback(
    (event) => {
      if (!selfRef.current?.contains(event.target)) {
        setEditable(false)
      }
    }, []
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    props.mapped.name = event.target.value
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