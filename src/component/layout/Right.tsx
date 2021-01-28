import React, {useEffect, useState} from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"
import Note from "../../model/Note"
import Notebook from "../../model/Notebook"
import Tag from "../../model/Tag"
import TagDisplay from "../tag/TagDisplay"
import TabMenuItem from "../tab_menu/TabMenuItem"
import Sidebar from "./Sidebar"
import TagManager from "../tag/TagManager"

//intellij-esque side tab switcher:
// note overview - state, tags
// detailed information?
// tag overview/manager - list of all tags + editor in the bottom part
// complex filtering? - results on the left, most likely in a separate component
// version history, if that's ever a thing
const SidebarRight = (props: {
  activeNotebook: Notebook | undefined,
  activeNote: Note | undefined,
  activeTag: Tag | undefined,
  onActiveTagChange: (tag: Tag | undefined) => any
}) => {

  const [children, setChildren] = useState<Array<React.ReactElement> | React.ReactElement>([])

  const onTabClick = (children: Array<React.ReactElement> | React.ReactElement) => {
    setChildren(children)
  }

  useEffect(
    () => {
      console.log("blob")
    }, [props.activeNote]
  )

  return (
    <Sidebar orientation={Orientation.RIGHT}
             tabs={
               <TabMenu orientation={Orientation.RIGHT} onClick={onTabClick}>
                 <TabMenuItem text={"Note Tags"} defaultSelected>
                   <TagDisplay activeNote={props.activeNote}/>
                 </TabMenuItem>
                 <TabMenuItem text={"Tag Overview"}>
                   <TagManager activeNotebook={props.activeNotebook} activeTag={props.activeTag}
                               onActiveTagChange={props.onActiveTagChange}
                   />
                 </TabMenuItem>
                 <TabMenuItem text={"Filtering Options"}>
                 </TabMenuItem>
                 <TabMenuItem text={"Note Details"}>
                 </TabMenuItem>
               </TabMenu>
             }
    >
      {children}
    </Sidebar>
  )

}

export default SidebarRight