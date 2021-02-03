import React, {useEffect} from "react"
import {ActionMeta, ValueType} from "react-select"
import Creatable from "react-select/creatable"
import Notebook from "../model/Notebook"

const NotebookSelector = <T extends Notebook>(props: {
  notebooks: T[] | undefined,
  selection?: T | undefined
  onActiveChange: (active: T | undefined) => any
}) => {

  const [active, setActive] = React.useState<T | undefined>(props.selection)

  const handleChange = (value: ValueType<T, false>, action: ActionMeta<T>) => {
    setActive(value as T)
  }

  useEffect(
    () => {
      props.onActiveChange(active)
    }, [active]
  )

  return (
    <Creatable<T> id="snovy-selector-notebook" className="react-select-container" classNamePrefix="react-select"
                  placeholder="Select notebook or add new..."
                  value={active}
                  options={props.notebooks}
                  getOptionLabel={(option) => option.name} getOptionValue={((option) => option.name)}
                  onChange={handleChange}
    />
  )

}

export default NotebookSelector