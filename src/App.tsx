import React, {useEffect, useState} from "react"
import "./App.scss"
import "./util/Augments"
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
import OptionsContext from "./util/OptionsContext"
import Options, {defaultOptions} from "./data/model/options/Options"
import TabMenu, {Alignment, Orientation} from "./component/tab_menu/TabMenu"
import {makeTab} from "./component/tab_menu/TabMenuItem"
import Selector from "./component/sidebar/left/Selector"
import {saveAs} from "file-saver"
import NoteDetail from "./component/sidebar/right/NoteDetail"
import TagManager from "./component/sidebar/right/TagManager"
import OptionsManager from "./component/OptionsManager"

const App = (props: {
  dexie: Database
}) => {

  const [options, setOptions] = useState<Options>(defaultOptions)

  const [notebooks, setNotebooks] = useState<Array<Notebook>>([])

  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | undefined>()
  const [selectedSections, setSelectedSections] = useState<Array<Section>>([])
  const [selectedNotes, setSelectedNotes] = useState<Array<Note>>([])
  const [tag, setTag] = useState<Tag | undefined>()

  useEffect(
    () => {
      props.dexie.open()

      dexie.transaction("rw", [dexie.options, dexie.notebooks, dexie.sections, dexie.notes, dexie.scopes, dexie.tags,
        dexie.states], async () => {
        setOptions(await Options.getFromDb())

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
    <OptionsContext.Provider value={options}>
      <span id="snovy-app" onContextMenu={(e) => e.preventDefault()}>
        <TabMenu orientation={Orientation.LEFT} id="left-menu">{[
          makeTab(mappingsLeft.notes, Alignment.START, setActiveTabLeft, activeTabLeft),
          makeTab(mappingsLeft.search, Alignment.START, setActiveTabLeft, activeTabLeft),
          makeTab("⮉", Alignment.END, () => {
            saveAs(new File([exportData()], "data.json", {type: "text/json;charset=utf-8"}))
          }, activeTabLeft, true),
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
          <TagManager notebook={selectedNotebook} tag={tag} onTagChange={selectTag}/>
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
    </OptionsContext.Provider>
  )
}

export default App
