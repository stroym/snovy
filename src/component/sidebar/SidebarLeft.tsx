import React, {useState} from "react"
import Note from "../../data/model/Note"
import Section from "../../data/model/Section"
import Notebook from "../../data/model/Notebook"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import {makeTab} from "../tab_menu/TabMenuItem"
import Selector from "./left/Selector"
import {saveAs} from "file-saver"
import {dexie} from "../../index"

//TODO move tab menus outside sidebars
export const SidebarLeft = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Array<Section> | Section | undefined) => void,
  onNoteChange: (active: Array<Note> | Note | undefined) => void,
  notebooks: Array<Notebook>,
  selectedNotebook: Notebook | undefined,
  selectedSections: Array<Section>,
  selectedNotes: Array<Note>,
  exportData: () => string
}) => {

  const mappings = {
    notes: "Notes",
    search: "Search",
    options: "⚙"
  }

  const [activeTab, setActiveTab] = useState<string>(mappings.notes)

  return (
    <div className="snovy-sidebar">
      <TabMenu orientation={Orientation.LEFT}>{[
        makeTab(mappings.notes, Alignment.START, setActiveTab, activeTab),
        makeTab(mappings.search, Alignment.START, setActiveTab, activeTab),
        makeTab("⮉", Alignment.END, () => {
          saveAs(new File([props.exportData()], "data.json", {type: "text/json;charset=utf-8"}))
        }, activeTab, true),
        makeTab("☠", Alignment.END, async () => await dexie.delete(), activeTab, true),
        makeTab(mappings.options, Alignment.END, setActiveTab, activeTab, true),
        makeTab("❱", Alignment.END, setActiveTab, activeTab, true)
      ]}
      </TabMenu>
      <div className={"sidebar-content " + Orientation.LEFT} id={Orientation.LEFT + "-content"}>
        {activeTab == mappings.notes &&
        <Selector
          notebooks={props.notebooks}
          selectedNotebook={props.selectedNotebook} onNotebookChange={props.onNotebookChange}
          selectedSections={props.selectedSections} onSectionChange={props.onSectionChange}
          selectedNotes={props.selectedNotes} onNoteChange={props.onNoteChange}
        />
        }
      </div>
    </div>
  )

}

export default SidebarLeft