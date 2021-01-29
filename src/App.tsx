import React, {useState} from "react"
import "./App.scss"
import TopBar from "./component/layout/Top"
import LeftBar from "./component/layout/SidebarLeft"
import RightBar from "./component/layout/SidebarRight"
import BottomBar from "./component/layout/Bottom"
import Editor from "./component/layout/Editor"
import Notebook from "./model/Notebook"
import Section from "./model/Section"
import Manager from "./model/Manager"
import Tag from "./model/Tag"
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
      <div id="snovy-middle">
        <NoteProvider>
          <LeftBar onActiveSectionChange={selectSection}
                   onActiveNotebookChange={selectNotebook} manager={manager}
                   activeNotebook={activeNotebook} activeSection={activeSection}
          />
          <Editor/>
          <RightBar activeNotebook={activeNotebook} activeTag={activeTag} onActiveTagChange={selectTag}
          />
        </NoteProvider>
      </div>
      <BottomBar/>
    </div>
  )
}

declare global {
  interface Array<T> {
    first(): T | undefined,

  }
}

Array.prototype.first = function <T>(): T | undefined {
  return this.length > 0 ? this[0] : undefined
}

export default App
