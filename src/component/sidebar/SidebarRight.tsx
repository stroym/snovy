import React, {useState} from "react"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import Notebook from "../../data/model/Notebook"
import Tag from "../../data/model/Tag"
import Note from "../../data/model/Note"
import {makeTab} from "../tab_menu/TabMenuItem"
import TagManager from "./right/TagManager"
import NoteDetail from "./right/NoteDetail"

const SidebarRight = (props: {
  notebook: Notebook | undefined,
  note: Note | undefined,
  tag: Tag | undefined,
  onTagChange: (tag?: Tag) => void
  onTagRemove: (note: Note, tag: Tag) => void
}) => {

  const mappings = {
    detail: "Note Detail",
    tagManager: "Tags",
    stateManager: "States",
    filtering: "Filtering Options"
  }

  const [activeTab, setActiveTab] = useState<string>(mappings.detail)

  return (
    <>
      <div className={"snovy-sidebar " + Orientation.RIGHT} id="right-sidebar">
        {activeTab == mappings.detail && props.notebook && props.note &&
        <NoteDetail note={props.note} notebook={props.notebook}/>
        }
        {activeTab == mappings.tagManager &&
        <TagManager notebook={props.notebook}/>
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
    </>
  )

}

export default SidebarRight