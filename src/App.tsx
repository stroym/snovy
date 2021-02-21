import React, {useState} from "react"
import "./App.scss"
import "./util/Augments"
import SidebarLeft from "./component/sidebar/SidebarLeft"
import RightBar from "./component/sidebar/SidebarRight"
import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Manager from "./model/Manager"
import Tag from "./model/colored/Tag"
import Note from "./model/Note"
import Editor from "./component/editor/Editor"
import {isArray} from "./util/Utils"

function App() {

  const [manager, _setManager] = useState<Manager>(new Manager())
  const [notebook, setNotebook] = useState<Notebook | undefined>()
  const [tag, setTag] = useState<Tag | undefined>()

  const [sections, setSections] = useState<Array<Section>>([])
  const [notes, setNotes] = useState<Array<Note>>([])

  const selectNotebook = (active: Notebook | undefined) => {
    setNotebook(active)
  }

  const selectSections = (active: Array<Section> | Section | undefined) => {
    if (isArray(active)) {
      setSections(active)
      active.isEmpty() && setNotes([])
    } else if (active) {
      setSections([active])
    } else {
      setSections([])
      setNotes([])
    }
  }

  const selectNotes = (active: Array<Note> | Note | undefined) => {
    if (isArray(active)) {
      setNotes(active)
    } else if (active) {
      setNotes([active])
    } else {
      setNotes([])
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
        manager={manager}
        onNotebookChange={selectNotebook} notebook={notebook}
        onSectionChange={selectSections} sections={sections}
        onNoteChange={selectNotes} notes={notes}
      />
      <Editor activeNote={notes.first()}/>
      <RightBar onTagRemove={untag} note={notes.first()} notebook={notebook} tag={tag} onTagChange={selectTag}/>
    </span>
  )
}

export default App
