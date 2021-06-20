import React from "react"
import "./style/app.scss"
import "./util/augments"
import Editor from "./component/editor/Editor"
import {Alignment, Orientation} from "./component/tab_menu/TabMenu"
import Selector from "./component/sidebar/left/Selector"
import Detail from "./component/sidebar/right/Detail"
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
import {default as SearchIcon} from "../public/icons/search.svg"
import {default as ArchiveIcon} from "../public/icons/archived.svg"
import {default as NotesIcon} from "../public/icons/notes.svg"
import {default as DetailIcon} from "../public/icons/detail.svg"
import {default as ManagerIcon} from "../public/icons/manager.svg"
import {default as ResourcesIcon} from "../public/icons/resources.svg"
import {activeItem, highlightedItem, selectedItem} from "./util/classes"
import Favorites from "./component/sidebar/left/Favorites"
import Search from "./component/sidebar/left/Search"
import Archive from "./component/sidebar/left/Archive"
import Resources from "./component/sidebar/right/Resources"

//TODO move props into interfaces, extend basic html props, use destructuring wherever possible

//TODO class names/ids into enums?

const App = () => {

  const theme = useTheme()

  const mappings = {
    notes: "Notes",
    favorites: "Favorites",
    search: "Search",
    resources: "Resources",
    archive: "Archive",
    options: "Options",
    detail: "Detail",
    manager: "Manager"
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
        color: ${theme.textPrimary};

        &,
        .snovy-context-menu,
        .snovy-dropdown,
        .snovy-options,
        .snovy-form {
          background-color: ${theme.primary};
        }

        .${activeItem}:not(.mono) {
          background-color: ${theme.activeItem};
        }

        .${highlightedItem},
        .styled-hover:not(.color-item,.mono):hover {
          background-color: ${theme.hover} !important;
        }

        .snovy-list-item:focus-within {
          [data-whatinput="keyboard"] & {
            background-color: ${theme.hover} !important;
          }
        }

        .${selectedItem} {
          background-color: ${darken(0.05, theme.activeItem)};
        }

        * {
          border-color: ${theme.border};
        }

        *:focus {
          outline-color: ${theme.accent};

          [data-whatinput="keyboard"] & {
            :not(.mono) > svg {
              fill: ${theme.accent};
            }

            :is(.snovy-tab-menu-item) > svg {
              fill: ${theme.textSecondary};
            }

            :is(.mono) > svg {
              opacity: 0.5;
            }
          }
        }
      `}
    >
      <Sidebar orientation={Orientation.LEFT} initialTab={mappings.notes}>
        {[
          {
            tabAlignment: Alignment.START, icon: <NotesIcon/>, tooltip: mappings.notes,
            viewable: {
              text: mappings.notes,
              content: <Selector/>
            }
          },
          {
            tabAlignment: Alignment.START, icon: <FavoritesIcon/>, tooltip: mappings.favorites,
            viewable: {
              text: mappings.favorites,
              content: <Favorites/>
            }
          },
          {
            tabAlignment: Alignment.START, icon: <SearchIcon/>, tooltip: mappings.search,
            viewable: {
              text: mappings.search,
              content: <Search/>
            }
          },
          {
            tabAlignment: Alignment.END, icon: <ArchiveIcon/>, tooltip: mappings.archive,
            viewable: {
              text: mappings.archive,
              content: <Archive/>
            }
          },
          {
            tabAlignment: Alignment.END, icon: <OptionsIcon/>, tooltip: mappings.options,
            viewable: {
              text: mappings.options,
              toggle: true,
              content: <Portal node={document.getElementById("snovy-app")}><OptionsManager/></Portal>
            }
          }
        ]}
      </Sidebar>
      <Editor editorStyle={outlineStyle}/>
      <Sidebar initialTab={mappings.detail} orientation={Orientation.RIGHT}>
        {[
          {
            tabAlignment: Alignment.START, icon: <DetailIcon/>, tooltip: mappings.detail,
            viewable: {
              text: mappings.detail,
              content: <Detail/>
            }
          },
          {
            tabAlignment: Alignment.START, icon: <ManagerIcon/>, tooltip: mappings.manager,
            viewable: {
              text: mappings.manager,
              content: <Manager/>
            }
          },
          {
            tabAlignment: Alignment.END, icon: <ResourcesIcon/>, tooltip: mappings.resources,
            viewable: {
              text: mappings.resources,
              content: <Resources/>
            }
          }
        ]}
      </Sidebar>
      <ReactTooltip backgroundColor={theme.border} delayShow={300}/>
      </span>
  )
}

export default App