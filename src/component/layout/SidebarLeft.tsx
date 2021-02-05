import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {OrderedItem} from "../../model/common/Base"
import {Orientation} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {ManagedSidebar} from "./Sidebar"
import List from "../list/List"
import ComboBox from "../ComboBox"

export const LeftBar = (props: {
  onActiveNotebookChange: (active: Notebook | undefined) => void,
  onActiveSectionChange: (active: Section | undefined) => void,
  onActiveNoteChange: (active: Note | undefined) => void,
  manager: Manager,
  activeNotebook: Notebook | undefined,
  activeSection: Section | undefined,
  activeNote: Note | undefined
}) => {

  const [activeContext, setActiveContext] = useState<Notebook | Section | Note | undefined | null>()

  const onContextChange = (target: Notebook | Section | Note | undefined | null) => {
    setActiveContext(target)
  }

  return (
    <ManagedSidebar orientation={Orientation.LEFT} tabs={mappings}>
      {[{
        text: mappings[0].text, children: [
          <ComboBox
            id="notebook-selector"
            key="notebook-selector" items={props.manager.itemsSortedAlphabetically}
            onActiveChange={props.onActiveNotebookChange}
            createItem={(name: string) => {return props.manager.insert(name)}}
            selection={props.activeNotebook ?? props.manager.items.first()}
          />,
          <span key="lists-span" id="lists-span">
            <>
              <List<Section>
                key={buildKey(props.activeNotebook, sectionsId)} id={sectionsId}
                items={props.activeNotebook?.itemsSortedByOrder}
                selection={props.activeSection} defaultFirst
                onActiveChange={props.onActiveSectionChange} onContextChange={onContextChange}
                contextChildren={buildContext(activeContext, props.activeNotebook, () => {
                  if (props.activeSection == activeContext) {
                    props.onActiveSectionChange(undefined)
                  }

                  return props.activeSection == activeContext
                })
                }
              />
              <List<Note>
                key={buildKey(props.activeSection, notesId)} id={notesId}
                items={props.activeSection?.itemsSortedByOrder}
                selection={props.activeNote} defaultFirst
                onActiveChange={props.onActiveNoteChange} onContextChange={onContextChange}
                contextChildren={buildContext(activeContext, props.activeSection, () => {
                  if (props.activeNote == activeContext) {
                    props.onActiveNoteChange(undefined)
                  }

                  return props.activeNote == activeContext
                })}
              />
            </>
          </span>
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
function buildContext(activeContext: Notebook | Section | Note | undefined | null, target: Section | Notebook | undefined, deletion: () => boolean) {
  return target ? [
    <ContextMenuItem
      key={"new"} text={"new"} onClick={
      () => {
        if (activeContext) {
          target!.insertAt(activeContext.order + 1)
        } else {
          target!.insert()
        }
      }}
    />,
    ...activeContext ? [
      <ContextMenuItem
        key={"delete"} text={"delete"} onClick={
        () => {
          console.log(target!.deleteById(activeContext.id))

          deletion()
        }}
      />
    ] : []
  ] : undefined
}

export default LeftBar