import React, {useState} from "react"
import "./App.scss"
import "./util/Augments"
import TopBar from "./component/layout/Top"
import LeftBar from "./component/layout/SidebarLeft"
import RightBar from "./component/layout/SidebarRight"
import BottomBar from "./component/layout/Bottom"
import Editor from "./component/layout/Editor"
import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Manager from "./model/Manager"
import Tag from "./model/coloured/Tag"
import Note from "./model/Note"

const man = new Manager()

function App() {

  const [manager, _setManager] = useState<Manager>(man)
  const [notebook, setNotebook] = useState<Notebook | undefined>()
  const [section, setSection] = useState<Section | undefined>()
  const [note, setNote] = useState<Note | undefined>()
  const [tag, setTag] = useState<Tag | undefined>()

  const selectNotebook = (active: Notebook | undefined) => {
    setNotebook(active)
  }

  const selectSection = (active: Section | undefined) => {
    setSection(active)
  }

  const selectNote = (active: Note | undefined) => {
    setNote(active)
  }

  const selectTag = (active: Tag | undefined) => {
    setTag(active)
  }

  const untag = (note: Note, tag: Tag) => {
    note.untag(tag)
    console.log("click")
  }

  return (
    <div id="snovy-app">
      <TopBar/>
      <span id="snovy-middle">
          <LeftBar
            onActiveSectionChange={selectSection} onActiveNoteChange={selectNote}
            onActiveNotebookChange={selectNotebook} manager={manager}
            activeNotebook={notebook} activeSection={section} activeNote={note}
          />
          <Editor activeNote={note}/>
          <RightBar onTagRemove={untag} note={note} notebook={notebook} tag={tag} onTagChange={selectTag}/>
      </span>
      <BottomBar/>
    </div>
  )
}

export default App
