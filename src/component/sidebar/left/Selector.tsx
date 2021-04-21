import React, {useEffect, useRef, useState} from "react"
import Section from "../../../data/model/Section"
import Note from "../../../data/model/Note"
import ComboBox from "../../combo_box/ComboBox"
import Notebook from "../../../data/model/Notebook"
import List from "../../list/List"
import {makeContext, makeSharedContext} from "../../context_menu/ContextMenuItem"
import ContextMenu from "../../context_menu/ContextMenu"
import SidebarContent from "../SidebarContent"

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

  const [activeSection, setActiveSection] = useState<Section | undefined>()

  useEffect(
    () => {
      setActiveSection(props.selectedSections.first())
    }, [props.selectedSections]
  )

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

  return (
    <SidebarContent
      id="notes-selector"
      heading={<ComboBox
        id="notebook-selector" newItem={{getInputValue: createItem, name: "notebook"}}
        items={props.notebooks} selectedItem={props.selectedNotebook} onItemSelect={props.onNotebookChange}
      />}
    >
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
        {
          makeContext(
            "New section",
            async () => {sectionContext ? await props.selectedNotebook?.add(sectionContext.order + 1) : await props.selectedNotebook?.add()},
            "+",
            "& go",
            async () => props.onSectionChange(sectionContext ? await props.selectedNotebook?.add(sectionContext.order + 1) : await props.selectedNotebook?.add())
          )
        }
        {
          sectionContext && makeContext(
            "New section (as last)",
            () => {props.selectedNotebook?.add()},
            "+",
            "& go",
            async () => props.onSectionChange(await props.selectedNotebook?.add())
          ) && makeSharedContext({
            single: {
              text: "Delete section",
              action: async () => {
                const neighbour = await props.selectedNotebook?.remove(sectionContext)
                neighbour == undefined || sectionContext == props.selectedSections.first() && props.onSectionChange(neighbour)
              }
            },
            multiple: {
              condition: props.selectedSections.hasMore(),
              text: `Delete ${props.selectedSections.length} sections`,
              action: async () => {props.onSectionChange(await props.selectedNotebook?.remove(props.selectedSections))}
            },
            icon: "×"
          })
        }
      </ContextMenu>
      <List
        ref={noteRef} id="snovy-list-note" defaultFirst items={activeSection?.itemsSortedByOrder}
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
        {
          makeContext(
            "New note",
            async () => {noteContext ? await activeSection?.add(noteContext.order + 1) : await activeSection?.add()},
            "+",
            "& go",
            async () => props.onNoteChange(noteContext ? await activeSection?.add(noteContext.order + 1) : await activeSection?.add())
          )
        }
        {
          noteContext && makeContext(
            "New note (as last)",
            () => {activeSection?.add()},
            "+",
            "& go",
            async () => props.onNoteChange(await activeSection?.add())
          ) && makeSharedContext({
            single: {
              text: "Delete note",
              action: async () => {
                const neighbour = await activeSection?.remove(noteContext)
                neighbour == undefined || noteContext == props.selectedNotes.first() && props.onNoteChange(neighbour)
              }
            },
            multiple: {
              condition: props.selectedNotes.hasMore(),
              text: `Delete ${props.selectedNotes.length} notes`,
              action: async () => {props.onNoteChange(await activeSection?.remove(props.selectedNotes))}
            },
            icon: "×"
          })
        }
      </ContextMenu>
    </SidebarContent>
  )

}

export default Selector