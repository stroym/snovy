import React, {useState} from "react"
import "./App.scss"
import TopBar from "./component/layout/Top"
import LeftBar from "./component/layout/Left"
import RightBar from "./component/layout/Right"
import BottomBar from "./component/layout/Bottom"
import Editor from "./component/layout/Editor"
import Note from "./model/Note"
import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Manager from "./model/Manager"

function App() {

  const [manager, setManager] = useState<Manager>(new Manager())
  const [activeNotebook, setActiveNotebook] = useState<Notebook | undefined>()
  const [activeSection, setActiveSection] = useState<Section | undefined>()
  const [activeNote, setActiveNote] = useState<Note | undefined>()

  const selectNotebook = (active: Notebook | undefined) => {
    setActiveNotebook(active)
  }

  const selectSection = (active: Section | undefined) => {
    setActiveSection(active)
  }

  const selectNote = (active: Note | undefined) => {
    setActiveNote(active)
    console.log(active)
  }

  return (
    <div id="snovy-app">
      <TopBar/>
      <div id="snovy-middle">
        <LeftBar onActiveSectionChange={selectSection} onActiveNoteChange={selectNote}
                 onActiveNotebookChange={selectNotebook} manager={manager}
                 activeNotebook={activeNotebook} activeSection={activeSection} activeNote={activeNote}
        />
        <Editor activeNote={activeNote}/>
        <RightBar activeNote={activeNote}/>
      </div>
      <BottomBar/>
    </div>
  )
}

export default App
