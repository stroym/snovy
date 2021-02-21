import React from "react"
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

  return (
    <>
      <ComboBox
        id="notebook-selector" items={props.manager.itemsSortedAlphabetically}
        onActiveChange={props.onNotebookChange}
        createItem={(name: string) => {return props.manager.insert(name)}}
        selection={props.notebook ?? props.manager.itemsSortedById.first()}
      />
      <span id="lists-span">
        <List<Section>
          items={props.notebook?.itemsSortedByOrder} selection={props.sections} defaultFirst
          onSelect={props.onSectionChange}
          buildContext={contextItem => buildContextMenu(contextItem, props.notebook, "section", props.sections, props.onSectionChange)}
        />
        <List<Note>
          items={props.sections.first()?.itemsSortedByOrder} selection={props.notes} defaultFirst
          onSelect={props.onNoteChange}
          buildContext={(contextItem => buildContextMenu(contextItem, props.sections.first(), "note", props.notes, props.onNoteChange))}
        />
      </span>
    </>
  )

}

//TODO while this is pretty convinient, it's also a fairly contrived way of doing this
function buildContextMenu<I extends Note | Section, P extends WithOrderedChildren<I>>(
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