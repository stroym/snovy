import React, {useEffect, useState} from "react"
import "./App.scss"
import "./util/Augments"
import Notebook from "./data/model/Notebook"
import Section from "./data/model/Section"
import Note from "./data/model/Note"
import Editor from "./component/editor/Editor"
import {isArray} from "./util/Utils"
import {dexie} from "./index"
import "dexie-export-import"
import {Table} from "./data/model/Base"
import TabMenu, {Alignment, Orientation} from "./component/tab_menu/TabMenu"
import TabMenuItem, {CollapseTabMenuItem} from "./component/tab_menu/TabMenuItem"
import Selector from "./component/sidebar/left/Selector"
import NoteDetail from "./component/sidebar/right/NoteDetail"
import Manager from "./component/sidebar/right/Manager"
import {css, useTheme} from "@emotion/react"
import {lighten} from "polished"
import OptionsManager from "./component/options/OptionsManager"
import ReactTooltip from "react-tooltip"

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
          const loaded = values

          setNotebooks(loaded.sort(Table.compareById))
          await selectNotebook(loaded.first())
        })
      })
    }, []
  )

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

  const mappings = {
    notes: "🗊",
    favorites: "☆",
    search: "⚲",
    archive: "🗄",
    options: "⚙",
    detail: "🕮",
    manager: "🏷"
  }

  const [leftTab, setLeftTab] = useState<string>(mappings.notes)
  const [rightTab, setRightTab] = useState<string>(mappings.detail)

  const [leftVisible, setLeftVisible] = useState(true)
  const [rightVisible, setRightVisible] = useState(true)

  return (
    <span
      id="snovy-app" onContextMenu={e => e.preventDefault()}
      css={css`
        color: ${theme.textPrimary};
        background-color: ${theme.primary};
        scrollbar-color: ${theme.accent} ${lighten(0.1, theme.accent)};

        *:not(.snovy-button) {
          border-color: ${theme.border};
        }

        * {

          &:focus {
            outline-color: ${theme.accent};
          }
        }
      `}
    >
      <TabMenu orientation={Orientation.LEFT} id="left-menu">
        <TabMenuItem
          text={mappings.notes} alignment={Alignment.START} onActiveChange={setLeftTab} active={leftTab} icon
        />
        <TabMenuItem
          text={mappings.favorites} alignment={Alignment.START} onActiveChange={setLeftTab} active={leftTab} icon
        />
        <TabMenuItem
          text={mappings.search} alignment={Alignment.START} active={leftTab} icon
          style={{
            transform: "rotate(-45deg)",
            fontSize: "1.5vw"
          }}
          onActiveChange={value => {
            setRightTab(value)
            setLeftTab(value)
          }}
        />
        <TabMenuItem
          text={mappings.archive} alignment={Alignment.END} onActiveChange={setLeftTab} active={leftTab} icon
        />
        <TabMenuItem
          text={"☠"} alignment={Alignment.END} active={leftTab} icon
          onActiveChange={async () => {
            await dexie.delete()
            window.location.reload()
          }}
        />
        <TabMenuItem
          text={mappings.options} alignment={Alignment.END} active={leftTab} icon tooltip="Options"
          onActiveChange={text => {
            if (leftTab == mappings.options && text == mappings.options) {
              setLeftTab(mappings.notes)
            } else {
              setLeftTab(text)
            }
          }}
        />
        <CollapseTabMenuItem
          alignment={Alignment.END} orientation={Orientation.RIGHT}
          onActiveChange={() => {
            setLeftVisible(!leftVisible)
            document.getElementById("snovy-editor")?.focus()
          }}
        />
      </TabMenu>
      <div
        className={"snovy-sidebar " + Orientation.LEFT} id="left-sidebar"
        style={{
          display: leftVisible ? "initial" : "none",
          visibility: leftVisible ? "initial" : "hidden"
        }}
      >
        {leftTab == mappings.notes &&
        <Selector
          notebooks={notebooks}
          selectedNotebook={selectedNotebook} onNotebookChange={selectNotebook}
          selectedSections={selectedSections} onSectionChange={selectSections}
          selectedNotes={selectedNotes} onNoteChange={selectNotes}
        />
        }
      </div>
      <Editor activeNote={selectedNotes.first()}/>
      <div
        className={"snovy-sidebar " + Orientation.RIGHT} id="right-sidebar"
        style={{
          display: rightVisible ? "initial" : "none",
          visibility: rightVisible ? "initial" : "hidden"
        }}
      >
        {
          rightTab == mappings.detail && selectedNotebook && !selectedNotes.isEmpty() && selectedNotes.first() &&
          <NoteDetail note={selectedNotes.first()!} notebook={selectedNotebook}/>
        }
        {
          rightTab == mappings.manager && <Manager notebook={selectedNotebook}/>
        }
      </div>
      <TabMenu orientation={Orientation.RIGHT} id="right-menu">
        <TabMenuItem
          text={mappings.detail} alignment={Alignment.START} onActiveChange={setRightTab} active={rightTab} icon
        />
        <TabMenuItem
          text={mappings.manager} alignment={Alignment.START} onActiveChange={setRightTab} active={rightTab} icon
        />
        <TabMenuItem
          text={mappings.search} alignment={Alignment.START} onActiveChange={setRightTab} active={rightTab} icon
          style={{
            transform: "rotate(-45deg)",
            fontSize: "1.5vw"
          }}
        />
        <CollapseTabMenuItem
          alignment={Alignment.END} orientation={Orientation.LEFT}
          onActiveChange={() => {
            setRightVisible(!rightVisible)
            document.getElementById("snovy-editor")?.focus()
          }}
        />
      </TabMenu>
      {
        leftTab == mappings.options && <OptionsManager/>
      }
      <ReactTooltip backgroundColor={theme.border} delayShow={300}/>
      </span>
  )
}

export default App
