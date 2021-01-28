import React, {useEffect} from "react"
import {ActionMeta, ValueType} from "react-select"
import Creatable from "react-select/creatable"
import Notebook from "../model/Notebook"

const NotebookSelector = (props: {
  notebooks: Notebook[] | undefined,
  onActiveChange: (active: Notebook | undefined) => any
}) => {

  const [active, setActive] = React.useState<Notebook | undefined>(props.notebooks && props.notebooks.length > 0 ? props.notebooks[0] : undefined)

  const handleChange = (value: ValueType<Notebook, false>, action: ActionMeta<Notebook>) => {
    setActive(value as Notebook)
  }

  useEffect(
    () => {
      props.onActiveChange(active)
    }, [active]
  )

  return (
    <span id="snovy-selector-notebook">
    <Creatable<Notebook> id="notebook-select" className="react-select-container" classNamePrefix="react-select"
                         placeholder="Select notebook or add new..."
                         value={active}
                         options={props.notebooks}
                         getOptionLabel={(option) => option.name} getOptionValue={((option) => option.name)}
                         onChange={handleChange}
    />
    </span>
  )

}

export default NotebookSelector