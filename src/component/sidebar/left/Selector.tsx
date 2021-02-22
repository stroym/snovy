import React, {useState} from "react"
import Section from "../../../data/model/Section"
import Note from "../../../data/model/Note"
import ComboBox from "../../combo_box/ComboBox"
import Notebook from "../../../data/model/Notebook"
import Manager from "../../../data/model/Manager"
import List from "../../list/List"
import {WithOrderedChildren} from "../../../data/model/common/Base"
import ContextMenuItem, {makeContext, makeSharedContext} from "../../context_menu/ContextMenuItem"

export const Selector = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Array<Section> | Section | undefined) => void,
  onNoteChange: (active: Array<Note> | Note | undefined) => void,
  manager: Manager,
  notebook: Notebook | undefined,
  sections: Array<Section>,
  notes: Array<Note>
}) => {

  const [sectionContext, setSectionContext] = useState<Section | null | undefined>(null)
  const [noteContext, setNoteContext] = useState<Note | null | undefined>(null)

  return (
    <div id="notes-selector">
      <ComboBox
        items={props.manager.itemsSortedAlphabetically}
        selection={props.notebook ?? props.manager.itemsSortedById.first()}
        onActiveChange={props.onNotebookChange}
        createItem={(name: string) => {return props.manager.insert(name)}}
      />
      <List
        items={props.notebook?.itemsSortedByOrder} selection={props.sections} onSelect={props.onSectionChange}
        defaultFirst
        context={{
          items: buildContextMenu(sectionContext, props.notebook, "section", props.sections, props.onSectionChange),
          onChange: setSectionContext
        }}
      />
      <List<Note>
        items={props.sections.first()?.itemsSortedByOrder} selection={props.notes} defaultFirst
        onSelect={props.onNoteChange}
        context={{
          items: buildContextMenu(noteContext, props.sections.first(), "note", props.notes, props.onNoteChange),
          onChange: setNoteContext
        }}
      />
    </div>
  )

}

//TODO make this list specific - this is handy, but unwieldys
export function buildContextMenu<I extends Note | Section, P extends WithOrderedChildren<I>>(
  contextItem: I | undefined | null,
  parent: P | undefined,
  descriptor: string,
  selectedItems: Array<I>,
  setMulti: (active: Array<I> | I | undefined) => void
): Array<React.ReactElement<typeof ContextMenuItem>> {
  const contexts: Array<React.ReactElement<typeof ContextMenuItem>> = []

  if (parent) {
    contexts.push(
      makeContext(
        `New ${descriptor}`,
        () => {contextItem ? parent.insert(contextItem.order + 1) : parent.insert()},
        "+",
        "& go",
        () => {setMulti(contextItem ? parent.insert(contextItem.order + 1) : parent.insert())}
      )
    )

    if (contextItem) {
      contexts.push(
        makeContext(
          `New ${descriptor} (as last)`,
          () => {parent.insert()},
          "+",
          "& go",
          () => {setMulti(parent.insert())}
        )
      )

      contexts.push(
        makeSharedContext({
            single: {
              text: `Delete ${descriptor}`,
              action: () => {
                const neighbour = parent.deleteItem(contextItem)
                neighbour == undefined || contextItem == selectedItems.first() && setMulti(neighbour)
              }
            },
            multiple: {
              condition: selectedItems.hasMore(),
              text: `Delete ${selectedItems.length} ${descriptor}s`,
              action: () => {setMulti(parent.deleteItems(selectedItems))}
            },
            icon: "×"
          }
        )
      )

    }
  }

  return contexts
}

export default Selector