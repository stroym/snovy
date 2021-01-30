import React from "react"
import {Orientation} from "../tab_menu/TabMenu"
import Notebook from "../../model/Notebook"
import Tag from "../../model/coloured/Tag"
import {ManagedSidebar} from "./Sidebar"
import TagDisplay from "../tag/TagDisplay"
import TagManager from "../tag/TagManager"

const SidebarRight = (props: {
  activeNotebook: Notebook | undefined,
  activeTag: Tag | undefined,
  onActiveTagChange: (tag: Tag | undefined) => any
}) => {

  return (
    <ManagedSidebar orientation={Orientation.RIGHT} tabs={mappings}>
      {[{
        text: mappings[0].text, children: <TagDisplay/>
      }, {
        text: mappings[1].text, children: <TagManager activeNotebook={props.activeNotebook} activeTag={props.activeTag}
                                                      onActiveTagChange={props.onActiveTagChange}/>
      }]}
    </ManagedSidebar>
  )

}

const mappings = [
  {text: "Note Tags", default: true},
  {text: "Tag Manager"},
  {text: "Filtering Options"},
  {text: "Note Details"}
]

export default SidebarRight