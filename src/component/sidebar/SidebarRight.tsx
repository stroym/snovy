import React, {useState} from "react"
import TabMenu, {Alignment, Orientation} from "../tab_menu/TabMenu"
import Notebook from "../../model/Notebook"
import Tag from "../../model/colored/Tag"
import Note from "../../model/Note"
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

  const mappings = {detail: "Note Detail", manager: "Tag Manager", filtering: "Filtering Options"}

  const [activeTab, setActiveTab] = useState<string>(mappings.detail)

  return (
    <div className="snovy-sidebar">
      <div className={"sidebar-content " + Orientation.RIGHT} id={Orientation.RIGHT + "-content"}>
        {activeTab == mappings.detail && props.notebook && props.note &&
        <NoteDetail note={props.note} notebook={props.notebook}/>
        }
        {activeTab == mappings.manager &&
        <TagManager notebook={props.notebook} tag={props.tag} onTagChange={props.onTagChange}/>
        }
      </div>
      <TabMenu orientation={Orientation.RIGHT}>{[
        makeTab(mappings.detail, Alignment.START, setActiveTab, activeTab),
        makeTab(mappings.manager, Alignment.START, setActiveTab, activeTab),
        makeTab(mappings.filtering, Alignment.START, setActiveTab, activeTab)
      ]}
      </TabMenu>
    </div>
  )

}

export default SidebarRight