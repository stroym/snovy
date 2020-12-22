import React from "react";
import Creatable from "react-select/creatable";
import {menuStyle} from "../Search";

export default class NotebookSelector extends React.Component {

  render() {
    return (
      <span id="snovy-selector-notebook">
        <Creatable id="notebook-select" className="react-select" placeholder="Select notebook or add new..."
                   styles={menuStyle}/>
      </span>
    );
  }

}