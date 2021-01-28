import React, {useState} from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"
import Note from "../../model/Note"
import Notebook from "../../model/Notebook"
import Tag from "../../model/Tag"
import TagDisplay from "../tag/TagDisplay"
import TabMenuItem from "../tab_menu/TabMenuItem"
import Sidebar from "./Sidebar"

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

  const [activeTab, setActiveTab] = useState()

  return (
    <Sidebar orientation={Orientation.RIGHT}
             classList={["jel"]}
             tabs={
               <TabMenu orientation={Orientation.RIGHT}>
                 <TabMenuItem text={"hello"}/>
                 <TabMenuItem text={"bye"}/>
               </TabMenu>
             }
    >
      <></>
      <TagDisplay activeNote={props.activeNote}/>
      {/*<TagManager activeNotebook={props.activeNotebook} activeTag={props.activeTag}*/}
      {/*            onActiveTagChange={props.onActiveTagChange}*/}
      {/*/>*/}
    </Sidebar>
  )

}

export default SidebarRight