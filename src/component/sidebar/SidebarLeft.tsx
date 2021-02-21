import React, {useState} from "react"
import Note from "../../model/Note"
import Section from "../../model/Section"
import Notebook from "../../model/Notebook"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import Manager from "../../model/Manager"
import {makeTab} from "../tab_menu/TabMenuItem"
import Selector from "./left/Selector"
import {saveAs} from "file-saver"

export const SidebarLeft = (props: {
  onNotebookChange: (active: Notebook | undefined) => void,
  onSectionChange: (active: Array<Section> | Section | undefined) => void,
  onNoteChange: (active: Array<Note> | Note | undefined) => void,
  manager: Manager,
  notebook: Notebook | undefined,
  sections: Array<Section>,
  notes: Array<Note>
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
        makeTab("⚘", Alignment.END, () => {
          saveAs(new File([props.manager.export()], "data.json", {type: "text/json;charset=utf-8"}))
        }, activeTab, true),
        makeTab("⚖", Alignment.END, setActiveTab, activeTab, true),
        makeTab(mappings.options, Alignment.END, setActiveTab, activeTab, true)
      ]}
      </TabMenu>
      <div className={"sidebar-content " + Orientation.LEFT} id={Orientation.LEFT + "-content"}>
        {activeTab == mappings.notes &&
        <Selector
          manager={props.manager} notebook={props.notebook} sections={props.sections} notes={props.notes}
          onNotebookChange={props.onNotebookChange} onSectionChange={props.onSectionChange}
          onNoteChange={props.onNoteChange}
        />
        }
      </div>
    </div>
  )

}

export default SidebarLeft