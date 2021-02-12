import React from "react"
import {Orientation, Tab} from "../tab_menu/TabMenu"
import Notebook from "../../model/Notebook"
import Tag from "../../model/colored/Tag"
import {Sidebar} from "./Sidebar"
import NoteDetail from "../NoteDetail"
import TagManager from "../tag/TagManager"
import Note from "../../model/Note"

const SidebarRight = (props: {
  notebook: Notebook | undefined,
  note: Note | undefined,
  tag: Tag | undefined,
  onTagChange: (tag?: Tag) => void
  onTagRemove: (note: Note, tag: Tag) => void
}) => {

  return (
    <Sidebar orientation={Orientation.RIGHT} startTabs={startMappings} endTabs={endMappings}>
      {[
        {
          text: startMappings[0].text,
          children: props.notebook && props.note && <NoteDetail note={props.note} notebook={props.notebook}/>
        },
        {
          text: startMappings[1].text,
          children: <TagManager notebook={props.notebook} tag={props.tag} onTagChange={props.onTagChange}/>
        }
      ]}
    </Sidebar>
  )

}

const startMappings = [
  new Tab("Note Detail", true),
  new Tab("Tag Manager"),
  new Tab("Filtering Options")
]

const endMappings = [new Tab("⚠")]

export default SidebarRight