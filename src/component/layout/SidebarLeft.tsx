import React, {useContext, useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {OrderedItem} from "../../model/common/Base"
import {Orientation} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {ManagedSidebar} from "./Sidebar"
import {NoteContext} from "../../Context"
import NotebookSelector from "../NotebookSelector"
import List from "../list/List"

export const LeftBar = (props: {
  onActiveNotebookChange: (active: Notebook | undefined) => any,
  onActiveSectionChange: (active: Section | undefined) => any,
  manager: Manager,
  activeNotebook: Notebook | undefined,
  activeSection: Section | undefined,
}) => {

  const noteContext = useContext(NoteContext)

  if (!noteContext) {
    return null
  }

  const [activeContext, setActiveContext] = useState<Notebook | Section | Note | undefined>()

  const onContextChange = (target: any) => {
    setActiveContext(target)
  }

  //TODO remember selected note when switching tabs
  return (
    <ManagedSidebar orientation={Orientation.LEFT} tabs={mappings}>
      {[{
        text: mappings[0].text, children: [
          <NotebookSelector key="notebook-selector" notebooks={props.manager.items}
                            onActiveChange={props.onActiveNotebookChange}
                            selection={props.activeNotebook ?? props.manager.items.first()}
          />,
          <List<Section> key={buildKey(props.activeNotebook, sectionsId)} id={sectionsId}
                         items={props.activeNotebook?.itemsSortedByOrder}
                         selection={props.activeSection} defaultFirst
                         onActiveChange={props.onActiveSectionChange} onContextChange={onContextChange}
                         contextChildren={buildContext(activeContext, props.activeNotebook, () => {
                           if (props.activeSection == activeContext) {
                             props.onActiveSectionChange(undefined)
                           }
                         })
                         }
          />,
          <List<Note> key={buildKey(props.activeSection, notesId)} id={notesId}
                      items={props.activeSection?.itemsSortedByOrder}
                      selection={noteContext.activeNote} defaultFirst
                      onActiveChange={noteContext.setActiveNote} onContextChange={onContextChange}
                      contextChildren={buildContext(activeContext, props.activeSection, () => {
                        if (noteContext.activeNote == activeContext) {
                          noteContext.setActiveNote(undefined)
                        }
                      })}
          />
        ]
      }]}
    </ManagedSidebar>
  )

}

const mappings = [
  {text: "Notes", default: true},
  {text: "Search"}
]

const sectionsId = "snovy-list-section"
const notesId = "snovy-list-note"

function buildKey(parent: OrderedItem | undefined, defaultKey: string) {
  return parent ? parent.constructor.name + parent?.id + "items" : defaultKey
}

//TODO autoselect previous item when currently selected is deleted
function buildContext(activeContext: Notebook | Section | Note | undefined, target: Section | Notebook | undefined, deletion: () => any) {
  return target ? [
    <ContextMenuItem key={"new"} text={"new"} onClick={() => {
      if (activeContext) {
        target!.insertAt(activeContext.order + 1)
      } else {
        target!.insert()
      }
    }}/>,
    ...activeContext ? [
      <ContextMenuItem key={"delete"} text={"delete"} onClick={() => {
        target!.deleteById(activeContext.id)

        deletion()
      }}/>
    ] : []
  ] : undefined
}

export default LeftBar