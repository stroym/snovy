import React from "react";
import NotebookSelector from "../selector/Notebook";
import Note from "../../model/Note";
import Section from "../../model/Section";
import Notebook from "../../model/Notebook";
import SelectorList from "../shared/SelectorList";

export const LeftBar = (props: {
  onActiveNotebookChange: (active: Notebook | undefined) => any,
  onActiveSectionChange: (active: Section | undefined) => any,
  onActiveNoteChange: (active: Note | undefined) => any,
  notebooks: Notebook[],
  sections: Section[] | undefined,
  notes: Note[] | undefined
}) => {

  return (
    <div id="snovy-bar-left">
      <NotebookSelector notebooks={props.notebooks} onActiveChange={props.onActiveNotebookChange}/>
      <SelectorList<Section> id="snovy-selector-section" items={props.sections}
                             onActiveChange={props.onActiveSectionChange}/>
      <SelectorList<Note> id="snovy-selector-note" items={props.notes} onActiveChange={props.onActiveNoteChange}/>
    </div>
  );

};

export default LeftBar;