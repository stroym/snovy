import React from "react";
import {ActionMeta, ValueType} from "react-select";
import Creatable from "react-select/creatable";
import Notebook from "../../model/Notebook";

type NotebookProps = {
  notebooks: Notebook[],
  selectActive: (active: Notebook | undefined) => any
}

const NotebookSelector = (props: NotebookProps) => {

  const [active, setActive] = React.useState<Notebook | undefined>(); //TODO select first option (if available) by default and fire change

  const handleChange = (value: ValueType<Notebook, false>, action: ActionMeta<Notebook>) => {
    setActive(value as Notebook);
    props.selectActive(value as Notebook);
  };

  return (
    <span id="snovy-selector-notebook">
    <Creatable id="notebook-select" className="react-select-container" classNamePrefix="react-select"
               placeholder="Select notebook or add new..."
               value={active}
               options={props.notebooks}
               getOptionLabel={(option) => option.name} getOptionValue={((option) => option.name)}
               onChange={handleChange}
    />
    </span>
  );

};

export default NotebookSelector;