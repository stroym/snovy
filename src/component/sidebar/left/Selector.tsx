import React, {useEffect, useState} from "react"
import Section from "../../../data/model/Section"
import Note from "../../../data/model/Note"
import ComboBox from "../../combo_box/ComboBox"
import Notebook from "../../../data/model/Notebook"
import List from "../../list/List"
import {WithOrderedChildren} from "../../../data/model/Base"
import ContextMenuItem, {makeContext, makeSharedContext} from "../../context_menu/ContextMenuItem"

export const Selector = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Array<Section> | Section | undefined) => void,
  onNoteChange: (active: Array<Note> | Note | undefined) => void,
  notebooks: Array<Notebook>,
  selectedNotebook: Notebook | undefined,
  selectedSections: Array<Section>,
  selectedNotes: Array<Note>
}) => {

  const [sectionContext, setSectionContext] = useState<Section | null | undefined>(null)
  const [noteContext, setNoteContext] = useState<Note | null | undefined>(null)

  //TODO persist selection on unmount
  useEffect(
    () => {

      return () => {
        props.onSectionChange([])
        props.onNoteChange([])
      }
    }, []
  )

  return (
    <div id="notes-selector">
      <ComboBox
        items={props.notebooks}
        selection={props.selectedNotebook}
        onActiveChange={props.onNotebookChange}
        createItem={async (name: string) => {
          const temp = await new Notebook(name).create()
          props.notebooks.push(temp)
          return temp
        }}
      />
      <List
        id="snovy-list-section" defaultFirst items={props.selectedNotebook?.itemsSortedByOrder}
        selection={props.selectedSections} onSelect={props.onSectionChange}
        context={{
          items: buildContextMenu(sectionContext, props.selectedNotebook, "section", props.selectedSections, props.onSectionChange),
          onChange: setSectionContext
        }}
      />
      <List<Note>
        id="snovy-list-note" defaultFirst items={props.selectedSections.first()?.itemsSortedByOrder}
        selection={props.selectedNotes} onSelect={props.onNoteChange}
        context={{
          items: buildContextMenu(noteContext, props.selectedSections.first(), "note", props.selectedNotes, props.onNoteChange),
          onChange: setNoteContext
        }}
      />
    </div>
  )

}

//TODO make this list specific - this is handy, but unwieldy
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
        () => {contextItem ? parent.add(contextItem.order + 1) : parent.add()},
        "+",
        "& go",
        () => {setMulti(contextItem ? parent.add(contextItem.order + 1) : parent.add())}
      )
    )

    if (contextItem) {
      contexts.push(
        makeContext(
          `New ${descriptor} (as last)`,
          () => {parent.add()},
          "+",
          "& go",
          () => {setMulti(parent.add())}
        )
      )

      contexts.push(
        makeSharedContext({
            single: {
              text: `Delete ${descriptor}`,
              action: () => {
                const neighbour = parent.remove(contextItem)
                neighbour == undefined || contextItem == selectedItems.first() && setMulti(neighbour)
              }
            },
            multiple: {
              condition: selectedItems.hasMore(),
              text: `Delete ${selectedItems.length} ${descriptor}s`,
              action: () => {setMulti(parent.remove(selectedItems))}
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