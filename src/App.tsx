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
import {Alignment, Orientation} from "./component/tab_menu/TabMenu"
import Selector from "./component/sidebar/left/Selector"
import NoteDetail from "./component/sidebar/right/NoteDetail"
import Manager from "./component/sidebar/right/Manager"
import {css, useTheme} from "@emotion/react"
import {darken, lighten, transparentize} from "polished"
import OptionsManager from "./component/options/OptionsManager"
import ReactTooltip from "react-tooltip"
import {Sidebar} from "./component/sidebar/Sidebar"
import {Portal} from "react-portal"
import {theme as outlineTheme} from "rich-markdown-editor"

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
    filtering: "⚖",
    resources: "⛏",
    archive: "🗄",
    options: "⚙",
    detail: "🕮",
    manager: "🏷"
  }

  const outlineStyle = {
    ...outlineTheme,
    background: "transparent",
    text: theme.textPrimary,
    code: theme.textPrimary,
    cursor: theme.textPrimary,

    tableDivider: theme.primary,
    tableSelected: theme.textPrimary,
    tableSelectedBackground: theme.accent,

    quote: theme.primary,
    codeBackground: theme.primary,
    codeBorder: theme.textPrimary,
    codeString: theme.activeItem
  }

  return (
    <span
      id="snovy-app" onContextMenu={e => e.preventDefault()}
      css={css`
        scrollbar-color: ${theme.accent} ${lighten(0.1, theme.accent)};

        &,
        .snovy-context-menu,
        .snovy-dropdown,
        .snovy-options,
        .snovy-form {
          background-color: ${theme.primary};
        }

        *:not(a, .snovy-tag-item *) {
          color: ${theme.textPrimary};
          border-color: ${theme.border};
        }

        .highlighted-item,
        .styled-hover:not(.color-item):hover {
          background-color: ${theme.hover};
        }

        .active-item {
          background-color: ${theme.activeItem};
        }

        .selected-item {
          background-color: ${darken(0.05, theme.activeItem)};
        }

        .mono {
          background-color: transparent;

          &:hover {
            background-color: ${transparentize(0.6, theme.textPrimary)};
          }
        }

        * {
          &:focus {
            outline-color: ${theme.accent};
          }
        }
      `}
    >
      <Sidebar orientation={Orientation.LEFT} initialTab={mappings.notes}>
        {[
          {
            text: mappings.notes, tabAlignment: Alignment.START, content:
              <Selector
                notebooks={notebooks}
                selectedNotebook={selectedNotebook} onNotebookChange={selectNotebook}
                selectedSections={selectedSections} onSectionChange={selectSections}
                selectedNotes={selectedNotes} onNoteChange={selectNotes}
              />
          },
          {
            text: mappings.favorites, tabAlignment: Alignment.START
          },
          {
            text: mappings.search, tabAlignment: Alignment.START
          },
          {
            text: mappings.archive, tabAlignment: Alignment.END
          },
          {
            text: "☠", tabAlignment: Alignment.END, action:
              async () => {
                await dexie.delete()
                window.location.reload()
              }
          },
          {
            text: mappings.options, tabAlignment: Alignment.END, toggle: true, tooltip: "Options", content:
              <Portal node={document.getElementById("snovy-app")}>
                <OptionsManager/>
              </Portal>
          }
        ]}
      </Sidebar>
      <Editor editorStyle={outlineStyle} activeNote={selectedNotes.first()}/>
      <Sidebar initialTab={mappings.detail} orientation={Orientation.RIGHT}>
        {[
          {
            text: mappings.detail, tabAlignment: Alignment.START, content:
              selectedNotebook && !selectedNotes.isEmpty() && selectedNotes.first() &&
              <NoteDetail note={selectedNotes.first()!} notebook={selectedNotebook}/>
          },
          {
            text: mappings.manager, tabAlignment: Alignment.START, content:
              <Manager notebook={selectedNotebook}/>
          },
          {
            text: mappings.filtering, tabAlignment: Alignment.START
          },
          {
            text: mappings.resources, tabAlignment: Alignment.END
          }
        ]}
      </Sidebar>
      <ReactTooltip backgroundColor={theme.border} delayShow={300}/>
      </span>
  )
}

export default App
