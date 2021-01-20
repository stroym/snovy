import React from "react"
import NotebookSelector from "../selector/Notebook"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import SelectorList from "../shared/SelectorList"
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
      <SelectorList<Notebook, Section> id="snovy-selector-section" holder={props.activeNotebook}
                                       onActiveChange={props.onActiveSectionChange}
                                       key={buildId(props.activeNotebook)}
      />
      <SelectorList<Section, Note> id="snovy-selector-note" holder={props.activeSection}
                                   onActiveChange={props.onActiveNoteChange}
                                   key={buildId(props.activeSection)}

      />
    </div>
  )

}

function buildId(parent?: Holder<any, any>) {
  if (parent) {
    return parent?.constructor.name + parent.id + "items"
  } else {
    return ""
  }
}

export default LeftBar