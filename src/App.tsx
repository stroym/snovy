import React, {useEffect, useState} from "react"
import "./style/App.scss"
import "./util/augments"
import Notebook from "./data/model/Notebook"
import Section from "./data/model/Section"
import Note from "./data/model/Note"
import Editor from "./component/editor/Editor"
import {isArray} from "./util/utils"
import {dexie} from "./index"
import "dexie-export-import"
import {Table} from "./data/model/Base"
import {Alignment, Orientation} from "./component/tab_menu/TabMenu"
import Selector from "./component/sidebar/left/Selector"
import NoteDetail from "./component/sidebar/right/NoteDetail"
import Manager from "./component/sidebar/right/Manager"
import {css, useTheme} from "@emotion/react"
import {darken, lighten} from "polished"
import OptionsManager from "./component/options/OptionsManager"
import ReactTooltip from "react-tooltip"
import {Sidebar} from "./component/sidebar/Sidebar"
import {Portal} from "react-portal"
import {theme as outlineTheme} from "rich-markdown-editor"
import {default as OptionsIcon} from "../public/icons/options.svg"
import {default as FavoritesIcon} from "../public/icons/favorites.svg"
import {default as FilterIcon} from "../public/icons/filter.svg"
import {default as SearchIcon} from "../public/icons/search.svg"
import {default as ArchiveIcon} from "../public/icons/archived.svg"
import {default as NotesIcon} from "../public/icons/notes.svg"
import {default as DetailIcon} from "../public/icons/detail.svg"
import {default as ManagerIcon} from "../public/icons/manager.svg"
import {default as ResourcesIcon} from "../public/icons/resources.svg"
import {activeItem, highlightedItem, selectedItem} from "./util/classes"
// import {default as Icon} from "../public/icons/"

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

        .${activeItem}:not(.mono) {
          background-color: ${theme.activeItem};
        }

        .${highlightedItem},
        .styled-hover:not(.color-item,.mono):hover {
          background-color: ${theme.hover} !important;
        }

        .${selectedItem} {
          background-color: ${darken(0.05, theme.activeItem)};
        }

        *:focus {
          outline-color: ${theme.accent};

          [data-whatinput="keyboard"] & {
            :not(.snovy-tab-menu-item) > svg {
              fill: ${theme.accent};
            }

            :is(.snovy-tab-menu-item) > svg {
              fill: ${theme.textSecondary};
            }
          }
        }
      `}
    >
      <Sidebar orientation={Orientation.LEFT} initialTab={mappings.notes}>
        {[
          {
            tabAlignment: Alignment.START,
            icon: <NotesIcon/>,
            viewable: {
              text: mappings.notes,
              content:
                <Selector
                  notebooks={notebooks} selectedNotebook={selectedNotebook} onNotebookChange={selectNotebook}
                  selectedSections={selectedSections} onSectionChange={selectSections}
                  selectedNotes={selectedNotes} onNoteChange={selectNotes}
                />
            }
          },
          {
            tabAlignment: Alignment.START,
            icon: <FavoritesIcon/>,
            viewable: {
              text: mappings.favorites
            }
          },
          {
            tabAlignment: Alignment.START,
            icon: <SearchIcon/>,
            viewable: {
              text: mappings.search
            }
          },
          {
            tabAlignment: Alignment.END,
            icon: <ArchiveIcon/>,
            viewable: {
              text: mappings.archive
            }
          },
          {
            tabAlignment: Alignment.END,
            icon: <OptionsIcon/>,
            tooltip: "Options",
            viewable: {
              text: mappings.options,
              toggle: true,
              content: <Portal node={document.getElementById("snovy-app")}><OptionsManager/></Portal>
            }
          }
        ]}
      </Sidebar>
      <Editor editorStyle={outlineStyle} activeNote={selectedNotes.first()}/>
      <Sidebar initialTab={mappings.detail} orientation={Orientation.RIGHT}>
        {[
          {
            tabAlignment: Alignment.START,
            icon: <DetailIcon/>,
            viewable: {
              text: mappings.detail,
              content:
                selectedNotebook && !selectedNotes.isEmpty() && selectedNotes.first() &&
                <NoteDetail note={selectedNotes.first()!} notebook={selectedNotebook}/>
            }
          },
          {
            tabAlignment: Alignment.START,
            icon: <ManagerIcon/>,
            viewable: {
              text: mappings.manager,
              content: <Manager/>
            }
          },
          {
            tabAlignment: Alignment.START,
            icon: <FilterIcon/>,
            viewable: {
              text: mappings.filtering
            }
          },
          {
            tabAlignment: Alignment.END,
            icon: <ResourcesIcon/>,
            viewable: {
              text: mappings.resources
            }
          }
        ]}
      </Sidebar>
      <ReactTooltip backgroundColor={theme.border} delayShow={300}/>
      </span>
  )
}

export default App