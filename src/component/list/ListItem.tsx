import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from "react"
import {Holder} from "../../model/Base"

const ListItem = <T extends Holder<any, any>>(props: {
  mapped: T,
  active: boolean
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

  const handleContext = (event: React.MouseEvent) => {
    event.stopPropagation()
    props.onContext(props.mapped)
  }

  const handleOutsideClick = useCallback(
    (event) => {
      if (!selfRef.current?.contains(event.target)) {
        setEditable(false)

        if (selfRef.current) {
          selfRef.current.classList.remove("editable")
          selfRef.current.selectionStart = selfRef.current.selectionEnd = 0
        }
      }
    }, []
  )

  const makeEditable = () => {
    setEditable(true)

    if (selfRef.current) {
      selfRef.current.selectionStart = selfRef.current.selectionEnd = -1
      selfRef.current.classList.add("editable")
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
    props.mapped.name = event.target.value
  }

  return (
    <input className={props.active ? "snovy-list-item selected" : "snovy-list-item"} ref={selfRef}
           type="text" value={value} placeholder={"Name..."} onChange={handleChange} readOnly={!editable}
           onClick={() => {props.onClick(props.mapped)}} onDoubleClick={makeEditable} onContextMenu={handleContext}
    />
  )

}

export default ListItem