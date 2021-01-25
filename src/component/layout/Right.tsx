import React, {useState} from "react"
import TabSwitcher, {Position} from "../TabSwitcher"
import Note from "../../model/Note"
import Notebook from "../../model/Notebook"
import Tag from "../../model/Tag"
import TagDisplay from "../tag/TagDisplay"

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
    <div id="snovy-bar-right">
      <div className="sidebar-inner-content" id="right-content">
        <span id="right-sidebar-content-filler"/>
        {/*<TagManager activeNotebook={props.activeNotebook} activeTag={props.activeTag}*/}
        {/*            onActiveTagChange={props.onActiveTagChange}*/}
        {/*/>*/}
        <TagDisplay tags={props.activeNote?.tagsArray}/>
      </div>
      <TabSwitcher position={Position.RIGHT}/>
    </div>
  )

}

export default SidebarRight