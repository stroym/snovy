import React from "react"
import {Orientation} from "../tab_menu/TabMenu"
import Notebook from "../../model/Notebook"
import Tag from "../../model/coloured/Tag"
import {ManagedSidebar} from "./Sidebar"
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
    <ManagedSidebar orientation={Orientation.RIGHT} tabs={mappings}>
      {[
        {
          text: mappings[0].text,
          children: props.notebook && props.note && <NoteDetail note={props.note} notebook={props.notebook}/>
        },
        {
          text: mappings[1].text,
          children: <TagManager notebook={props.notebook} tag={props.tag} onTagChange={props.onTagChange}/>
        }
      ]}
    </ManagedSidebar>
  )

}

const mappings = [
  {text: "Note Detail", default: true},
  {text: "Tag Manager"},
  {text: "Filtering Options"}
]

export default SidebarRight