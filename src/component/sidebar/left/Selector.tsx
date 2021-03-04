import React, {useEffect, useRef, useState} from "react"
import Section from "../../../data/model/Section"
import Note from "../../../data/model/Note"
import ComboBox from "../../combo_box/ComboBox"
import Notebook from "../../../data/model/Notebook"
import List from "../../list/List"
import {WithOrderedChildren} from "../../../data/model/Base"
import ContextMenuItem, {makeContext, makeSharedContext} from "../../context_menu/ContextMenuItem"
import ContextMenu from "../../context_menu/ContextMenu"

export const Selector = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Array<Section> | Section | undefined) => void,
  onNoteChange: (active: Array<Note> | Note | undefined) => void,
  notebooks: Array<Notebook>,
  selectedNotebook: Notebook | undefined,
  selectedSections: Array<Section>,
  selectedNotes: Array<Note>
}) => {

  const [contextActive, setContextActive] = useState(false)

  const [sectionContext, setSectionContext] = useState<Section | undefined>(undefined)
  const [noteContext, setNoteContext] = useState<Note | undefined>(undefined)

  useEffect(
    () => {
      if (sectionContext && !props.selectedSections.isEmpty() && !props.selectedSections.includes(sectionContext)) {
        props.onSectionChange([props.selectedSections.first()!])
      }
    }, [sectionContext]
  )

  useEffect(
    () => {
      if (noteContext && !props.selectedNotes.isEmpty() && !props.selectedNotes.includes(noteContext)) {
        props.onNoteChange([props.selectedNotes.first()!])
      }
    }, [noteContext]
  )

  //TODO persist selection on unmount
  useEffect(
    () => {
      return () => {
        props.onSectionChange([])
        props.onNoteChange([])
      }
    }, []
  )

  const createItem = async (title: string) => {
    const newItem = await new Notebook(title).create()
    props.notebooks.push(newItem)
    props.onNotebookChange(newItem)
  }

  const secRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)

  //TODO split selected and active? issues with onItemValueChange and who knows what in the future
  return (
    <div id="notes-selector">
      <ComboBox
        id="notebook-selector" newItem={{getInputValue: createItem, name: "notebook"}}
        items={props.notebooks} selection={props.selectedNotebook} onSelect={props.onNotebookChange}
      />
      <List
        ref={secRef} id="snovy-list-section" defaultFirst items={props.selectedNotebook?.itemsSortedByOrder}
        selection={props.selectedSections} onSelect={props.onSectionChange} getContextTarget={setSectionContext}
        onItemValueChange={(str => {
          const it = props.selectedSections.first()

          if (it) {
            it.updateTitle(str)
          }
        })}
      />
      <ContextMenu parentRef={secRef} onFinish={() => setContextActive(!contextActive)}>
        {buildContextMenu(sectionContext, props.selectedNotebook, "section", props.selectedSections, props.onSectionChange)}
      </ContextMenu>
      <List
        ref={noteRef} id="snovy-list-note" defaultFirst items={props.selectedSections.first()?.itemsSortedByOrder}
        selection={props.selectedNotes} onSelect={props.onNoteChange} getContextTarget={setNoteContext}
        onItemValueChange={
          (str => {
            const it = props.selectedNotes.first()

            if (it) {
              it.updateTitle(str)
            }
          })
        }
      />
      <ContextMenu parentRef={noteRef} onFinish={() => setContextActive(!contextActive)}>
        {buildContextMenu(noteContext, props.selectedSections.first(), "note", props.selectedNotes, props.onNoteChange)}
      </ContextMenu>
    </div>
  )

}

//TODO make this list specific - this is handy, but unwieldy
export function buildContextMenu<I extends Note | Section, P extends WithOrderedChildren<I>>(
  contextItem: I | undefined,
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