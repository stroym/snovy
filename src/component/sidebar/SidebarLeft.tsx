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
  onSectionChange: (active: Array<Section>) => void,
  onNoteChange: (active: Array<Note>) => void,
  manager: Manager,
  notebook: Notebook | undefined,
  sections: Array<Section>,
  notes: Array<Note>
}) => {

  const [activeContext, setActiveContext] = useState<Section | Note | undefined | null>()

  const onContextChange = (target: Section | Note | undefined | null) => {
    setActiveContext(target)
  }

  const sectionContext = buildContextMenu(activeContext as Section, props.notebook, props.sections, props.onSectionChange)
  const noteContext = buildContextMenu(activeContext as Note, props.sections.first(), props.notes, props.onNoteChange)

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
                selection={props.sections.hasMore() ? props.sections : props.sections.first()}
                defaultFirst
                onContextChange={onContextChange}
                onMultipleSelection={props.onSectionChange}
                contextChildren={sectionContext}
              />
              <List<Note>
                key="snovy-list-note"
                items={props.sections.first()?.itemsSortedByOrder}
                selection={props.notes.hasMore() ? props.notes : props.notes.first()} defaultFirst
                onMultipleSelection={props.onNoteChange}
                onContextChange={onContextChange}
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
        () => {setMulti(contextItem ? [parent.insert(contextItem.order + 1)] : [parent.insert()])}
      )
    )

    if (contextItem) {
      contexts.push(
        buildContext(
          `New ${parent.childName} (as last)`,
          () => {parent.insert()},
          "+",
          "& go",
          () => {setMulti([parent.insert()])}
        )
      )

      if (!selectedItems.hasMore()) {
        contexts.push(
          buildContext(
            `Delete ${parent.childName}`,
            () => {
              const neighbour = parent.deleteItem(contextItem)

              if (neighbour == undefined) {
                setMulti([])
              } else if (contextItem == selectedItems.first()) {
                setMulti([neighbour])
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
              const neighbour = parent.deleteItems(selectedItems)
              if (neighbour == undefined) {
                setMulti([])
              } else {
                setMulti([neighbour])
              }
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