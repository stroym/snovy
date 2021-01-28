import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import List from "../list/List"
import {OrderedItem} from "../../model/Base"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"
import NotebookSelector from "../NotebookSelector"
import Manager from "../../model/Manager"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import Sidebar from "./Sidebar"
import TabMenuItem from "../tab_menu/TabMenuItem"

export const LeftBar = (props: {
  onActiveNotebookChange: (active: Notebook | undefined) => any,
  onActiveSectionChange: (active: Section | undefined) => any,
  onActiveNoteChange: (active: Note | undefined) => any,
  manager: Manager,
  activeNotebook: Notebook | undefined,
  activeSection: Section | undefined,
  activeNote: Note | undefined
}) => {

  const [activeContext, setActiveContext] = useState<Notebook | Section | Note | undefined>()

  const onContextChange = (target: any) => {
    setActiveContext(target)
  }

  //TODO autoselect previous item when currently selected is deleted
  return (
    <Sidebar orientation={Orientation.LEFT}
             tabs={
               <TabMenu orientation={Orientation.LEFT}>
                 <TabMenuItem text={"blob"}/>
                 <TabMenuItem text={"blib"}/>
               </TabMenu>
             }
    >
      <NotebookSelector notebooks={props.manager.items} onActiveChange={props.onActiveNotebookChange}/>
      <List<Section> id="snovy-list-section" items={props.activeNotebook?.itemsSortedByOrder} defaultSelection
                     onActiveChange={props.onActiveSectionChange} onContextChange={onContextChange}
                     key={buildId(props.activeNotebook) ?? Notebook.prototype.name}
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
      />
      <List<Note> id="snovy-list-note" items={props.activeSection?.itemsSortedByOrder} defaultSelection
                  onActiveChange={props.onActiveNoteChange} onContextChange={onContextChange}
                  key={buildId(props.activeSection) ?? Section.prototype.name}
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

                          if (props.activeNote == activeContext) {
                            props.onActiveNoteChange(undefined)
                          }
                        }
                        }/>
                      ] : []
                    ] : undefined
                  }
      />
    </Sidebar>
  )

}

function buildId(parent: OrderedItem | undefined) {
  return parent ? parent.constructor.name + parent?.id + "items" : undefined
}

export default LeftBar