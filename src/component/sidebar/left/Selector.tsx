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

export const Selector = () => {

  const appContext = useContext(AppContext)

  const [contextActive, setContextActive] = useState(false)
  const [sectionContext, setSectionContext] = useState<Section | undefined>(undefined)
  const [noteContext, setNoteContext] = useState<Note | undefined>(undefined)

  const [activeSection, setActiveSection] = useState<Section | undefined>()

  useEffect(
    () => {
      setActiveSection(appContext.selectedSections.first())
    }, [appContext.selectedSections]
  )

  useEffect(
    () => {
      if (sectionContext && !appContext.selectedSections.isEmpty() && !appContext.selectedSections.includes(sectionContext)) {
        appContext.setSelectedSections([appContext.selectedSections.first()!])
      }
    }, [sectionContext]
  )

  useEffect(
    () => {
      if (noteContext && !appContext.selectedNotes.isEmpty() && !appContext.selectedNotes.includes(noteContext)) {
        appContext.setSelectedNotes([appContext.selectedNotes.first()!])
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
        ref={secRef} id="snovy-list-section" items={appContext.activeNotebook?.itemsSortedByOrder}
        selection={appContext.selectedSections} onSelect={appContext.setSelectedSections} onContext={setSectionContext}
        onItemValueChange={str => handleTitleChange(appContext.selectedSections.first(), str)}
      />
      <ContextMenu parentRef={secRef} onFinish={() => setContextActive(!contextActive)}>
        {
          makeContext(
            "New section",
            async () => {sectionContext ? await appContext.activeNotebook?.add(sectionContext.order + 1) : await appContext.activeNotebook?.add()},
            "+",
            "& go",
            async () => appContext.setSelectedSections(sectionContext ? await appContext.activeNotebook?.add(sectionContext.order + 1) : await appContext.activeNotebook?.add())
          )
        }
        {
          sectionContext && makeContext(
            "New section (as last)",
            () => {appContext.activeNotebook?.add()},
            "+",
            "& go",
            async () => appContext.setSelectedSections(await appContext.activeNotebook?.add())
          ) && makeSharedContext({
            single: {
              text: "Delete section",
              action: async () => {
                const neighbour = await appContext.activeNotebook?.remove(sectionContext)
                neighbour == undefined || sectionContext == appContext.selectedSections.first() && appContext.setSelectedSections(neighbour)
              }
            },
            multiple: {
              condition: appContext.selectedSections.hasMore(),
              text: `Delete ${appContext.selectedSections.length} sections`,
              action: async () => {appContext.setSelectedSections(await appContext.activeNotebook?.remove(appContext.selectedSections))}
            },
            icon: "×"
          })
        }
      </ContextMenu>
      <List<Note>
        ref={noteRef} id="snovy-list-note" items={activeSection?.itemsSortedByOrder}
        selection={appContext.selectedNotes} onSelect={appContext.setSelectedNotes} onContext={setNoteContext}
        onItemValueChange={str => handleTitleChange(appContext.selectedNotes.first(), str)}
      />
      <ContextMenu parentRef={noteRef} onFinish={() => setContextActive(!contextActive)}>
        {
          makeContext(
            "New note",
            async () => {noteContext ? await activeSection?.add(noteContext.order + 1) : await activeSection?.add()},
            "+",
            "& go",
            async () => appContext.setSelectedNotes(noteContext ? await activeSection?.add(noteContext.order + 1) : await activeSection?.add())
          )
        }
        {
          noteContext && makeContext(
            "New note (as last)",
            () => {activeSection?.add()},
            "+",
            "& go",
            async () => appContext.setSelectedNotes(await activeSection?.add())
          ) && makeSharedContext({
            single: {
              text: "Delete note",
              action: async () => {
                const neighbour = await activeSection?.remove(noteContext)
                neighbour == undefined || noteContext == appContext.selectedNotes.first() && appContext.setSelectedNotes(neighbour)
              }
            },
            multiple: {
              condition: appContext.selectedNotes.hasMore(),
              text: `Delete ${appContext.selectedNotes.length} notes`,
              action: async () => {appContext.setSelectedNotes(await activeSection?.remove(appContext.selectedNotes))}
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