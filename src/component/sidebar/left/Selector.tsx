import React, {useContext, useEffect, useRef, useState} from "react"
import Section from "../../../data/model/Section"
import Note from "../../../data/model/Note"
import ComboBox from "../../combo_box/ComboBox"
import Notebook from "../../../data/model/Notebook"
import List from "../../list/List"
import {makeContext, makeSharedContext} from "../../context_menu/ContextMenuItem"
import SidebarContent from "../SidebarContent"
import {Titled} from "../../../data/model/Base"
import AppContext from "../../../util/AppContext"
import ContextMenu from "../../context_menu/ContextMenu"
import {useDefaultEmpty} from "../../../util/hooks"

export const Selector = () => {

  const appContext = useContext(AppContext)

  const [contextActive, setContextActive] = useState(false)
  const [sectionContext, setSectionContext] = useState<Section | undefined>(undefined)
  const [noteContext, setNoteContext] = useState<Note | undefined>(undefined)

  const [selectedSections, setSelectedSections] = useDefaultEmpty<Section>()
  const [selectedNotes, setSelectedNotes] = useDefaultEmpty<Note>()

  //TODO keeping track of the selected item(s) should probably be a part of useContextMenu
  useEffect(
    () => {
      if (sectionContext && !selectedSections.isEmpty() && !selectedSections.includes(sectionContext)) {
        setSelectedSections([selectedSections.first()!])
      }
    }, [sectionContext]
  )

  useEffect(
    () => {
      if (noteContext && !selectedNotes.isEmpty() && !selectedNotes.includes(noteContext)) {
        setSelectedNotes([selectedNotes.first()!])
      }
    }, [noteContext]
  )

  const createItem = async (title: string) => {
    const newItem = await new Notebook(title).save()
    appContext.notebooks.push(newItem)
    appContext.setActiveNotebook(newItem)
  }

  const secRef = useRef<HTMLOListElement>(null)
  const noteRef = useRef<HTMLOListElement>(null)

  return (
    <SidebarContent
      id="notes-selector"
      heading={
        <ComboBox
          id="notebook-selector" newItem={{getInputValue: createItem, name: "notebook"}}
          items={appContext.notebooks} selected={appContext.activeNotebook} onSelect={appContext.setActiveNotebook}
        />
      }
    >
      <List<Section>
        ref={secRef} id="snovy-list-section" items={appContext.sections}
        selection={selectedSections} onSelectionChange={setSelectedSections}
        active={appContext.activeSection} onActiveChange={appContext.setActiveSection}
        onContext={setSectionContext}
        onItemValueChange={str => handleTitleChange(appContext.activeSection, str)}
      />
      <ContextMenu parentRef={secRef} onFinish={() => setContextActive(!contextActive)}>
        {
          makeContext(
            "New section",
            async () => {sectionContext ? await appContext.activeNotebook?.add(sectionContext.order + 1) : await appContext.activeNotebook?.add()},
            "+",
            "& go",
            async () => setSelectedSections(sectionContext ? await appContext.activeNotebook?.add(sectionContext.order + 1) : await appContext.activeNotebook?.add())
          )
        }
        {
          sectionContext && makeContext(
            "New section (as last)",
            () => {appContext.activeNotebook?.add()},
            "+",
            "& go",
            async () => setSelectedSections(await appContext.activeNotebook?.add())
          ) && makeSharedContext({
            single: {
              text: "Delete section",
              action: async () => {
                const neighbour = await appContext.activeNotebook?.remove(sectionContext)
                neighbour == undefined || sectionContext == selectedSections.first() && setSelectedSections(neighbour)
              }
            },
            multiple: {
              condition: selectedSections.hasMore(),
              text: `Delete ${selectedSections.length} sections`,
              action: async () => {setSelectedSections(await appContext.activeNotebook?.remove(selectedSections))}
            },
            icon: "×"
          })
        }
      </ContextMenu>
      <List<Note>
        ref={noteRef} id="snovy-list-note" items={appContext.notes}
        selection={selectedNotes} onSelectionChange={setSelectedNotes}
        active={appContext.activeNote} onActiveChange={appContext.setActiveNote}
        onContext={setNoteContext}
        onItemValueChange={str => handleTitleChange(appContext.activeNote, str)}
      />
      <ContextMenu parentRef={noteRef} onFinish={() => setContextActive(!contextActive)}>
        {
          makeContext(
            "New note",
            async () => {noteContext ? await appContext.activeSection?.add(noteContext.order + 1) : await appContext.activeSection?.add()},
            "+",
            "& go",
            async () => setSelectedNotes(noteContext ? await appContext.activeSection?.add(noteContext.order + 1) : await appContext.activeSection?.add())
          )
        }
        {
          noteContext && makeContext(
            "New note (as last)",
            () => {appContext.activeSection?.add()},
            "+",
            "& go",
            async () => setSelectedNotes(await appContext.activeSection?.add())
          ) && makeSharedContext({
            single: {
              text: "Delete note",
              action: async () => {
                const neighbour = await appContext.activeSection?.remove(noteContext)
                neighbour == undefined || noteContext == selectedNotes.first() && setSelectedNotes(neighbour)
              }
            },
            multiple: {
              condition: selectedNotes.hasMore(),
              text: `Delete ${selectedNotes.length} notes`,
              action: async () => {setSelectedNotes(await appContext.activeSection?.remove(selectedNotes))}
            },
            icon: "×"
          })
        }
      </ContextMenu>
    </SidebarContent>
  )

}

async function handleTitleChange(item: Titled | undefined, newTitle: string) {
  if (item) {
    await item.updateTitle(newTitle)
  }
}

export default Selector