import React, {useState} from "react"
import TabSwitcher, {Position} from "../TabSwitcher"
import Note from "../../model/Note"
import TagManager from "../tag/TagManager"

//intellij-esque side tab switcher:
// note overview - state, tags
// detailed information?
// tag overview/manager - list of all tags + editor in the bottom part
// complex filtering? - results on the left, most likely in a separate component
// version history, if that's ever a thing
const SidebarRight = (props: {
  activeNote: Note | undefined
}) => {

  const [activeTab, setActiveTab] = useState()

  return (
    <div id="snovy-bar-right">
      <div className="sidebar-inner-content" id="right-content">
        <span id="right-sidebar-content-filler"/>
        <TagManager activeNote={props.activeNote}/>
        {/*<TagDisplay activeNote={props.activeNote}/>*/}
      </div>
      <TabSwitcher position={Position.RIGHT}/>
    </div>
  )

}

export default SidebarRight