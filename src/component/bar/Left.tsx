import React from "react";
import NotebookSelector from "../selector/Notebook";
import SectionSelector from "../selector/Section";
import NoteSelector from "../selector/Note";

export default class LeftBar extends React.Component {

  render() {
    return (
      <div id="snovy-bar-left">
        <NotebookSelector/>
        <SectionSelector/>
        <NoteSelector/>
      </div>
    );
  }

}