import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {ItemWithParent, ParentInterface} from "../../model/common/Base"
import {Orientation, Tab} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import ContextMenuItem, {buildContext} from "../context_menu/ContextMenuItem"
import {Sidebar} from "./Sidebar"
import List from "../list/List"
import ComboBox from "../combo_box/ComboBox"

export const SidebarLeft = (props: {
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

  const sectionContext = buildContextMenu(activeContext as Section, props.notebook, props.multiSections, props.onSectionChange, props.onSectionMultiselect)
  const noteContext = buildContextMenu(activeContext as Note, props.section, props.multiNotes, props.onNoteChange, props.onNoteMultiselect)

  return (
    <Sidebar orientation={Orientation.LEFT} startTabs={startMappings} endTabs={endMappings}>
      {[{
        text: startMappings[0].text, children: [
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
                selection={props.multiSections.hasMore() ? props.multiSections : props.section} defaultFirst
                onActiveChange={props.onSectionChange} onContextChange={onContextChange}
                onMultipleSelection={props.onSectionMultiselect}
                contextChildren={sectionContext}
              />
              <List<Note>
                key="snovy-list-note"
                items={props.section?.itemsSortedByOrder}
                selection={props.multiNotes.hasMore() ? props.multiNotes : props.note} defaultFirst
                onMultipleSelection={props.onNoteMultiselect}
                onActiveChange={props.onNoteChange} onContextChange={onContextChange}
                contextChildren={noteContext}
              />
            </>
          </span>
        ]
      }]}
    </Sidebar>
  )

}

const startMappings = [new Tab("Notes", true), new Tab("Search")]
const endMappings = [new Tab("⚘"), new Tab("⚖"), new Tab("⚙")]

function buildContextMenu<I extends ItemWithParent<P>, P extends ParentInterface<I>>(
  contextItem: I | undefined,
  parent: P | undefined,
  selectedItems: Array<I>,
  setActive: (active: I | undefined) => void,
  setMulti: (active: Array<I>) => void
) {
  const contexts: Array<React.ReactElement<typeof ContextMenuItem>> = []

  if (parent) {
    contexts.push(
      buildContext(
        `New ${parent.childName}`,
        () => {contextItem ? parent.insert(contextItem.order + 1) : parent.insert()},
        "+",
        "& go",
        () => {setActive(contextItem ? parent.insert(contextItem.order + 1) : parent.insert())}
      )
    )

    if (contextItem) {
      contexts.push(
        buildContext(
          `New ${parent.childName} (as last)`,
          () => {parent.insert()},
          "+",
          "& go",
          () => {setActive(parent.insert())}
        )
      )

      if (!selectedItems.hasMore()) {
        contexts.push(
          buildContext(
            `Delete ${parent.childName}`,
            () => {
              const neighbour = parent.deleteItem(contextItem)

              if (contextItem == selectedItems.first()) {
                setActive(neighbour)
              }
            },
            "×"
          )
        )
      } else {
        contexts.push(
          buildContext(
            `Delete ${selectedItems.length} ${parent.childName}s`,
            () => {
              setMulti([])
              setActive(parent.deleteItems(selectedItems))
            },
            "×"
          )
        )
      }
    }
  }

  return contexts
}

export default SidebarLeft