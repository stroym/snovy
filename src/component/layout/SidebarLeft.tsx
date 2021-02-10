import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {ItemWithParent, ParentInterface} from "../../model/common/Base"
import {Orientation} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import ContextMenuItem from "../context_menu/ContextMenuItem"
import {ManagedSidebar} from "./Sidebar"
import List from "../list/List"
import ComboBox from "../combo_box/ComboBox"

export const LeftBar = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Section | undefined) => void,
  onNoteChange: (active: Note | undefined) => void,
  onSectionMultiselect: (active: Array<Section>) => void,
  onNoteMultiselect: (active: Array<Note>) => void,
  manager: Manager,
  notebook: Notebook | undefined,
  section: Section | undefined,
  note: Note | undefined,
  multiSections: Array<Section>,
  multiNotes: Array<Note>
}) => {

  const [activeContext, setActiveContext] = useState<Section | Note | undefined | null>()

  const onContextChange = (target: Section | Note | undefined | null) => {
    setActiveContext(target)
  }

  const sectionContext = buildContext(activeContext as Section, props.notebook, props.multiSections, props.onSectionChange, props.onSectionMultiselect)
  const noteContext = buildContext(activeContext as Note, props.section, props.multiNotes, props.onNoteChange, props.onNoteMultiselect)

  return (
    <ManagedSidebar orientation={Orientation.LEFT} tabs={mappings}>
      {[{
        text: mappings[0].text, children: [
          <ComboBox
            id="notebook-selector"
            key="notebook-selector" items={props.manager.itemsSortedAlphabetically}
            onActiveChange={props.onNotebookChange}
            createItem={(name: string) => {return props.manager.insert(undefined, name)}}
            selection={props.notebook ?? props.manager.items.first()}
          />,
          <span key="lists-span" id="lists-span">
            <>
              <List<Section>
                key="snovy-list-section"
                items={props.notebook?.itemsSortedByOrder}
                selection={props.multiSections.isEmpty() ? props.section : props.multiSections} defaultFirst
                onActiveChange={props.onSectionChange} onContextChange={onContextChange}
                onMultipleSelection={props.onSectionMultiselect}
                contextChildren={sectionContext}
              />
              <List<Note>
                key="snovy-list-note"
                items={props.section?.itemsSortedByOrder}
                selection={props.multiNotes.isEmpty() ? props.note : props.multiNotes} defaultFirst
                onMultipleSelection={props.onNoteMultiselect}
                onActiveChange={props.onNoteChange} onContextChange={onContextChange}
                contextChildren={noteContext}
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

//TODO as is the split options are probably more annoying than useful - this behaviour should probably be configurable
function buildContext<I extends ItemWithParent<P>, P extends ParentInterface<I>>(
  contextItem: I | undefined,
  parent: P | undefined,
  selectedItems: Array<I>,
  setActive: (active: I | undefined) => void,
  setMulti: (active: Array<I>) => void
) {
  const contexts: Array<React.ReactElement<typeof ContextMenuItem>> = []

  if (parent) {
    contexts.push(
      <ContextMenuItem
        key={"new"} icon="+" text={`New ${parent.childName}`} specialText="& go"
        onClick={() => {contextItem ? parent.insert(contextItem.order + 1) : parent.insert()}}
        specialOnClick={() => {setActive(contextItem ? parent.insert(contextItem.order + 1) : parent.insert())}}
      />
    )

    if (contextItem) {
      contexts.push(
        <ContextMenuItem
          key={"new-at-end"} text={`New ${parent.childName} (as last)`} icon="+" specialText="& go"
          onClick={() => {parent.insert()}}
          specialOnClick={() => {setActive(parent.insert())}}
        />)

      if (!selectedItems.hasMore()) {
        contexts.push(
          <ContextMenuItem
            key={"delete"} text={`Delete ${parent.childName}`} icon="×"
            onClick={() => {
              const neighbour = parent.deleteItem(contextItem)

              if (contextItem == selectedItems.first()) {
                setActive(neighbour)
              }
            }}
          />
        )
      } else {
        contexts.push(
          <ContextMenuItem
            key={"delete"} text={`Delete ${selectedItems.length} ${parent.childName}s`} icon="×"
            onClick={() => {
              setMulti([])
              setActive(parent.deleteItems(selectedItems))
            }}
          />
        )
      }
    }
  }

  return contexts
}

export default LeftBar