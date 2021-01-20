import React, {useState} from "react"
import "./App.scss"
import TopBar from "./component/bar/Top"
import LeftBar from "./component/bar/Left"
import RightBar from "./component/bar/Right"
import BottomBar from "./component/bar/Bottom"
import Editor from "./component/Editor"
import Note from "./model/Note"
import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Manager from "./model/Manager"

let manager = new Manager()

function App() {

  const [notebooks, setNotebooks] = useState<Notebook[] | undefined>(manager.notebooks)
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
  }

  return (
    <div id="snovy-app">
      <TopBar/>
      <LeftBar onActiveNotebookChange={selectNotebook} notebooks={notebooks}
               onActiveSectionChange={selectSection} sections={activeNotebook?.itemsSortedByOrder}
               onActiveNoteChange={selectNote} notes={activeSection?.itemsSortedByOrder}
               activeNotebook={activeNotebook} activeSection={activeSection}
      />
      <Editor activeNote={activeNote}/>
      <RightBar/>
      <BottomBar/>
    </div>
  )
}

export default App
