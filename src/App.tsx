import React, {useEffect, useState} from "react"
import "./App.scss"
import "./util/Augments"
import Notebook from "./data/model/Notebook"
import Section from "./data/model/Section"
import Note from "./data/model/Note"
import Editor from "./component/editor/Editor"
import {isArray} from "./util/Utils"
import {dexie} from "./index"
import generate from "./data/Generator"
import {serialize} from "class-transformer"
import {Table} from "./data/model/Base"
import TabMenu, {Alignment, Orientation} from "./component/tab_menu/TabMenu"
import {makeTab} from "./component/tab_menu/TabMenuItem"
import Selector from "./component/sidebar/left/Selector"
import {saveAs} from "file-saver"
import NoteDetail from "./component/sidebar/right/NoteDetail"
import TagManager from "./component/sidebar/right/TagManager"
import {css, useTheme} from "@emotion/react"
import {lighten} from "polished"
import OptionsManager from "./component/options/OptionsManager"

//TODO move props into interfaces, extend basic html props, use destructuring wherever possible

//TODO class names/ids into enums?

const App = () => {

  const theme = useTheme()

  const [notebooks, setNotebooks] = useState<Array<Notebook>>([])

  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | undefined>()
  const [selectedSections, setSelectedSections] = useState<Array<Section>>([])
  const [selectedNotes, setSelectedNotes] = useState<Array<Note>>([])

  useEffect(
    () => {
      dexie.transaction("rw", [dexie.notebooks, dexie.sections, dexie.notes, dexie.scopes, dexie.tags, dexie.states], async () => {

        await dexie.notebooks.toArray().then(async function (values) {
          const loaded = values.length == 0 ? await generate() : values

          setNotebooks(loaded.sort(Table.compareById))
          await selectNotebook(loaded.first())
        })
      })
    }, []
  )

  const exportData = () => {
    saveAs(new File(
      [serialize([dexie.notebooks.toArray(), dexie.options.toArray()])],
      "data.json",
      {type: "text/json;charset=utf-8"}
    ))
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

  const mappingsLeft = {
    notes: "Notes",
    search: "Search",
    options: "⚙"
  }

  const mappings = {
    detail: "Note Detail",
    tagManager: "Tags",
    stateManager: "States",
    filtering: "Filtering Options"
  }

  const [activeTabLeft, setActiveTabLeft] = useState<string>(mappingsLeft.notes)
  const [activeTab, setActiveTab] = useState<string>(mappings.detail)

  return (
    <span
      id="snovy-app" onContextMenu={(e) => e.preventDefault()}
      css={css`
        background-color: ${theme.primary};
        scrollbar-color: ${theme.accent} ${lighten(0.1, theme.accent)};

        * {
          border-color: ${theme.border};

          &:focus {
            outline-color: ${theme.accent};
          }
        }
      `}
    >
        <TabMenu orientation={Orientation.LEFT} id="left-menu">{[
          makeTab(mappingsLeft.notes, Alignment.START, setActiveTabLeft, activeTabLeft),
          makeTab(mappingsLeft.search, Alignment.START, setActiveTabLeft, activeTabLeft),
          makeTab("⮉", Alignment.END, exportData, activeTabLeft, true),
          makeTab("☠", Alignment.END, async () => await dexie.delete(), activeTabLeft, true),
          makeTab(mappingsLeft.options, Alignment.END, text => {
            if (activeTabLeft == mappingsLeft.options && text == mappingsLeft.options) {
              setActiveTabLeft(mappingsLeft.notes)
            } else {
              setActiveTabLeft(text)
            }
          }, activeTabLeft, true),
          makeTab("❱", Alignment.END, setActiveTabLeft, activeTabLeft, true)
        ]}
        </TabMenu>
        <div className={"snovy-sidebar " + Orientation.LEFT} id="left-sidebar">
          {activeTabLeft == mappingsLeft.notes &&
          <Selector
            notebooks={notebooks}
            selectedNotebook={selectedNotebook} onNotebookChange={selectNotebook}
            selectedSections={selectedSections} onSectionChange={selectSections}
            selectedNotes={selectedNotes} onNoteChange={selectNotes}
          />
          }
        </div>
        <Editor activeNote={selectedNotes.first()}/>
        <div className={"snovy-sidebar " + Orientation.RIGHT} id="right-sidebar">
          {activeTab == mappings.detail && selectedNotebook && !selectedNotes.isEmpty() && selectedNotes.first() &&
          <NoteDetail note={selectedNotes.first()!} notebook={selectedNotebook}/>
          }
          {activeTab == mappings.tagManager &&
          <TagManager notebook={selectedNotebook}/>
          }
        </div>
        <TabMenu orientation={Orientation.RIGHT} id="right-menu">{[
          makeTab(mappings.detail, Alignment.START, setActiveTab, activeTab),
          makeTab(mappings.tagManager, Alignment.START, setActiveTab, activeTab),
          makeTab(mappings.stateManager, Alignment.START, setActiveTab, activeTab),
          makeTab(mappings.filtering, Alignment.START, setActiveTab, activeTab),
          makeTab("❰", Alignment.END, setActiveTab, activeTab, true)
        ]}
        </TabMenu>
      {activeTabLeft == mappingsLeft.options && <OptionsManager/>}
      </span>
  )
}

export default App
