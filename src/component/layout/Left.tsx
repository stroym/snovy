import React from "react"
import NotebookSelector from "../NotebookSelector"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import List from "../list/List"
import {Holder} from "../../model/Base"

export const LeftBar = (props: {
  onActiveNotebookChange: (active: Notebook | undefined) => any,
  onActiveSectionChange: (active: Section | undefined) => any,
  onActiveNoteChange: (active: Note | undefined) => any,
  activeNotebook: Notebook | undefined,
  activeSection: Section | undefined,
  notebooks: Notebook[] | undefined,
  sections: Section[] | undefined,
  notes: Note[] | undefined
}) => {

  return (
    <div id="snovy-bar-left">
      <NotebookSelector notebooks={props.notebooks} onActiveChange={props.onActiveNotebookChange}/>
      <List<Notebook, Section> id="snovy-selector-section" holder={props.activeNotebook}
                               onActiveChange={props.onActiveSectionChange}
                               key={buildId(props.activeNotebook) ?? Notebook.prototype.name}
      />
      <List<Section, Note> id="snovy-selector-note" holder={props.activeSection}
                           onActiveChange={props.onActiveNoteChange}
                           key={buildId(props.activeSection) ?? Section.prototype.name}

      />
    </div>
  )

}

function buildId(parent: Holder<any, any> | undefined) {
  return parent ? parent.constructor.name + parent?.id + "items" : undefined
}

export default LeftBar