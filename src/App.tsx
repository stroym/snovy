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

const man = new Manager()

function App() {

  const [manager, _setManager] = useState<Manager>(man)
  const [notebook, setNotebook] = useState<Notebook | undefined>()
  const [tag, setTag] = useState<Tag | undefined>()

  const [sections, setSections] = useState<Array<Section>>([])
  const [notes, setNotes] = useState<Array<Note>>([])

  const selectNotebook = (active: Notebook | undefined) => {
    setNotebook(active)
  }

  const selectSections = (active: Array<Section>) => {
    setSections(active)
    active.isEmpty() && setNotes([])
  }

  const selectNotes = (active: Array<Note>) => {
    setNotes(active)
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
