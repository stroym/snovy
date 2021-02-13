import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import {ItemWithParent, ParentInterface} from "../../model/common/Base"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import ContextMenuItem, {makeContext} from "../context_menu/ContextMenuItem"
import List from "../list/List"
import ComboBox from "../combo_box/ComboBox"
import {makeTab} from "../tab_menu/TabMenuItem"

export const SidebarLeft = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Array<Section>) => void,
  onNoteChange: (active: Array<Note>) => void,
  manager: Manager,
  notebook: Notebook | undefined,
  sections: Array<Section>,
  notes: Array<Note>
}) => {

  const mappings = {
    notes: "Notes",
    search: "Search",
    options: "⚙"
  }

  const [activeTab, setActiveTab] = useState<string>(mappings.notes)
  const [activeContext, setActiveContext] = useState<Section | Note | undefined | null>()

  const onContextChange = (target: Section | Note | undefined | null) => {
    setActiveContext(target)
  }

  const sectionContext = buildContextMenu(activeContext as Section, props.notebook, props.sections, props.onSectionChange)
  const noteContext = buildContextMenu(activeContext as Note, props.sections.first(), props.notes, props.onNoteChange)

  return (
    <div className="snovy-sidebar">
      <TabMenu orientation={Orientation.LEFT}>{[
        makeTab(mappings.notes, Alignment.START, setActiveTab, activeTab),
        makeTab(mappings.search, Alignment.START, setActiveTab, activeTab),
        makeTab("⚘", Alignment.END, setActiveTab, activeTab, true),
        makeTab("⚖", Alignment.END, setActiveTab, activeTab, true),
        makeTab(mappings.options, Alignment.END, setActiveTab, activeTab, true)
      ]}
      </TabMenu>
      <div className={"sidebar-content " + Orientation.LEFT} id={Orientation.LEFT + "-content"}>
        {activeTab == mappings.notes &&
        <>
          <ComboBox
            id="notebook-selector"
            key="notebook-selector" items={props.manager.itemsSortedAlphabetically}
            onActiveChange={props.onNotebookChange}
            createItem={(name: string) => {return props.manager.insert(undefined, name)}}
            selection={props.notebook ?? props.manager.items.first()}
          />
          <span key="lists-span" id="lists-span">
          <>
          <List<Section>
            key="snovy-list-section"
            items={props.notebook?.itemsSortedByOrder} selection={props.sections} defaultFirst
            onSelect={props.onSectionChange} onContextChange={onContextChange} contextChildren={sectionContext}
          />
          <List<Note>
            key="snovy-list-note"
            items={props.sections.first()?.itemsSortedByOrder} selection={props.notes} defaultFirst
            onSelect={props.onNoteChange} onContextChange={onContextChange} contextChildren={noteContext}
          />
          </>
          </span>
        </>
        }
      </div>
    </div>
  )

}

function buildContextMenu<I extends ItemWithParent<P>, P extends ParentInterface<I>>(
  contextItem: I | undefined,
  parent: P | undefined,
  selectedItems: Array<I>,
  setMulti: (active: Array<I>) => void
) {
  const contexts: Array<React.ReactElement<typeof ContextMenuItem>> = []

  if (parent) {
    contexts.push(
      makeContext(
        `New ${parent.childName}`,
        () => {contextItem ? parent.insert(contextItem.order + 1) : parent.insert()},
        "+",
        "& go",
        () => {setMulti(contextItem ? [parent.insert(contextItem.order + 1)] : [parent.insert()])}
      )
    )

    if (contextItem) {
      contexts.push(
        makeContext(
          `New ${parent.childName} (as last)`,
          () => {parent.insert()},
          "+",
          "& go",
          () => {setMulti([parent.insert()])}
        )
      )

      if (!selectedItems.hasMore()) {
        contexts.push(
          makeContext(
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
          makeContext(
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