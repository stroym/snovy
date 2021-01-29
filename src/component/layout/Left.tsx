import React, {useContext, useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {OrderedItem} from "../../model/Base"
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

  const mappings = [
    {text: "Notes", default: true},
    {text: "Search"}
  ]

  //TODO autoselect previous item when currently selected is deleted
  //TODO remember selected notebook/section/note when switching tabs
  return (
    <ManagedSidebar orientation={Orientation.LEFT} tabs={mappings}>
      {[{
        text: mappings[0].text, children: [
          <NotebookSelector key="notebook-selector" notebooks={props.manager.items}
                            onActiveChange={props.onActiveNotebookChange}
          />,
          <List<Section> key={buildKey(props.activeNotebook, "snovy-list-section")} id="snovy-list-section"
                         items={props.activeNotebook?.itemsSortedByOrder} defaultSelection
                         onActiveChange={props.onActiveSectionChange} onContextChange={onContextChange}
                         contextChildren={
                           props.activeNotebook ? [
                             <ContextMenuItem key={"new"} text={"new"} onClick={() => {
                               if (activeContext) {
                                 props.activeNotebook!.insertAt(activeContext.order + 1)
                               } else {
                                 props.activeNotebook!.insert()
                               }
                             }}/>,
                             ...activeContext ? [
                               <ContextMenuItem key={"delete"} text={"delete"} onClick={() => {
                                 props.activeNotebook!.deleteById(activeContext.id)

                                 if (props.activeSection == activeContext) {
                                   props.onActiveSectionChange(undefined)
                                 }
                               }
                               }/>
                             ] : []
                           ] : undefined
                         }
          />,
          <List<Note> key={buildKey(props.activeSection, "snovy-list-note")} id="snovy-list-note"
                      items={props.activeSection?.itemsSortedByOrder} defaultSelection
                      onActiveChange={noteContext.setActiveNote} onContextChange={onContextChange}
                      contextChildren={
                        props.activeSection ? [
                          <ContextMenuItem key={"new"} text={"new"} onClick={() => {
                            if (activeContext) {
                              props.activeSection!.insertAt(activeContext.order + 1)
                            } else {
                              props.activeSection!.insert()
                            }
                          }}/>,
                          ...activeContext ? [
                            <ContextMenuItem key={"delete"} text={"delete"} onClick={() => {
                              props.activeSection!.deleteById(activeContext.id)

                              if (noteContext.activeNote == activeContext) {
                                noteContext.setActiveNote(undefined)
                              }
                            }
                            }/>
                          ] : []
                        ] : undefined
                      }
          />
        ]
      }]}
    </ManagedSidebar>
  )

}

function buildKey(parent: OrderedItem | undefined, defaultKey: string) {
  return parent ? parent.constructor.name + parent?.id + "items" : defaultKey
}

export default LeftBar