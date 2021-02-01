import React, {useState} from "react"
import "./App.scss"
import "./Augments"
import TopBar from "./component/layout/Top"
import LeftBar from "./component/layout/SidebarLeft"
import RightBar from "./component/layout/SidebarRight"
import BottomBar from "./component/layout/Bottom"
import Editor from "./component/layout/Editor"
import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Manager from "./model/Manager"
import Tag from "./model/coloured/Tag"
import {NoteProvider} from "./Context"

function App() {

  const [manager, setManager] = useState<Manager>(new Manager())
  const [activeNotebook, setActiveNotebook] = useState<Notebook | undefined>()
  const [activeSection, setActiveSection] = useState<Section | undefined>()
  const [activeTag, setActiveTag] = useState<Tag | undefined>()

  const selectNotebook = (active: Notebook | undefined) => {
    setActiveNotebook(active)
  }

  const selectSection = (active: Section | undefined) => {
    setActiveSection(active)
  }

  const selectTag = (active: Tag | undefined) => {
    setActiveTag(active)
  }

  return (
    <div id="snovy-app">
      <TopBar/>
      <span id="snovy-middle">
        <NoteProvider>
          <LeftBar onActiveSectionChange={selectSection}
                   onActiveNotebookChange={selectNotebook} manager={manager}
                   activeNotebook={activeNotebook} activeSection={activeSection}
          />
          <Editor/>
          <RightBar activeNotebook={activeNotebook} activeTag={activeTag} onActiveTagChange={selectTag}
          />
        </NoteProvider>
      </span>
      <BottomBar/>
    </div>
  )
}

export default App
