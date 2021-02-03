import React, {ChangeEvent, useEffect, useRef, useState} from "react"
import Notebook from "../model/Notebook"
import {AddButton, CollapseButton} from "./Button"
import List from "./list/List"
import {useHideOnOutsideClick} from "../Hooks"

const MySelect = <T extends Notebook>(props: {
  items: Array<T> | undefined,
  selection?: T | undefined
  onActiveChange: (active: T | undefined) => any
}) => {

  const selfRef = useRef(null)

  const [active, setActive] = useState<T | undefined>(props.selection)
  const [value, setValue] = useState<string | undefined>(props.selection?.name)
  const [visible, setVisible] = useHideOnOutsideClick(selfRef)

  useEffect(
    () => {
      props.onActiveChange(active)
      setValue(active?.name)
      setVisible(false)
    }, [active]
  )

  //TODO autocomplete/revert to last active item
  // allow creating new items
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleOptions = () => {
    setVisible(!visible)
  }

  return (
    <span ref={selfRef} id="snovy-selector-notebook">
      <span id="outer-span">
        <span id="inner-span" onClick={handleOptions}>
          <input className="snovy-combobox" type="text" value={value} onChange={handleChange}/>
        <CollapseButton onClick={handleOptions}/>
        </span>
        <AddButton onClick={() => {}}/>
      </span>
      {visible &&
      <List<T> items={props.items} id="notebook-selector-list" selection={active}
               onActiveChange={(it) => setActive(it)}
      />
      }
    </span>
  )

}

export default MySelect