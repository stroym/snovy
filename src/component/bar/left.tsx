import React from "react";
import NotebookSelector from "../selector/notebook";
import SectionSelector from "../selector/section";
import NoteSelector from "../selector/note";

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