import React, {useEffect, useState} from "react"
import "./App.scss"
import "./util/Augments"
import SidebarLeft from "./component/sidebar/SidebarLeft"
import RightBar from "./component/sidebar/SidebarRight"
import Notebook from "./data/model/Notebook"
import Section from "./data/model/Section"
import Tag from "./data/model/Tag"
import Note from "./data/model/Note"
import Editor from "./component/editor/Editor"
import {isArray} from "./util/Utils"
import Database from "./data/Database"
import {dexie} from "./index"
import generate from "./data/Generator"
import {serialize} from "class-transformer"
import {Table} from "./data/model/Base"

const App = (props: {
  dexie: Database
}) => {

  const [notebooks, setNotebooks] = useState<Array<Notebook>>([])

  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | undefined>()
  const [selectedSections, setSelectedSections] = useState<Array<Section>>([])
  const [selectedNotes, setSelectedNotes] = useState<Array<Note>>([])
  const [tag, setTag] = useState<Tag | undefined>()

  useEffect(
    () => {
      props.dexie.open()

      dexie.transaction("rw", [dexie.notebooks, dexie.sections, dexie.notes, dexie.scopes, dexie.tags,
        dexie.states], async () => {
        await dexie.notebooks.toArray().then(async function (values) {
          const loaded = values.length == 0 ? await generate() : values
          // const loaded = values

          setNotebooks(loaded.sort(Table.compareById))
          await selectNotebook(loaded.first())
        })
      })

      return () => {
        props.dexie.close()
      }
    }, [props.dexie]
  )

  //TODO make sure to load everything before exporting... or maybe export dexie tables?
  const exportData = () => {
    return serialize(notebooks)
  }

  const resetSelected = () => {
    setSelectedSections([])
    setSelectedNotes([])
  }

  const selectNotebook = async (active: Notebook | undefined) => {
    if (active) {
      await active.load()
      setSelectedNotebook(active)
    }

    resetSelected()
  }

  const selectSections = async (active: Array<Section> | Section | undefined) => {
    if (isArray(active)) {
      await active.first()?.load()
      setSelectedSections(active)
      active.isEmpty() && setSelectedNotes([])
    } else if (active) {
      await active.load()
      setSelectedSections([active])
    } else {
      resetSelected()
    }
  }

  const selectNotes = async (active: Array<Note> | Note | undefined) => {
    if (isArray(active)) {
      await active.first()?.load()
      setSelectedNotes(active)
    } else if (active) {
      await active.load()
      setSelectedNotes([active])
    } else {
      setSelectedNotes([])
    }
  }

  const selectTag = (active: Tag | undefined) => {
    setTag(active)
  }

  const untag = (note: Note, tag: Tag) => {
    note.untag(tag)
  }

  return (
    <span id="snovy-app" onContextMenu={(e) => e.preventDefault()}>
      <SidebarLeft
        notebooks={notebooks} onNotebookChange={selectNotebook} selectedNotebook={selectedNotebook}
        onSectionChange={selectSections} selectedSections={selectedSections}
        onNoteChange={selectNotes} selectedNotes={selectedNotes}
        exportData={exportData}
      />
      <Editor activeNote={selectedNotes.first()}/>
      <RightBar
        onTagRemove={untag} note={selectedNotes.first()} notebook={selectedNotebook} tag={tag} onTagChange={selectTag}
      />
    </span>
  )
}

export default App
