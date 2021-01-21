import React from "react"
import TagManager from "../TagManager"
import TabSwitcher, {Position} from "../TabSwitcher"

//intellij-esque side tab switcher:
// note overview - state, tags
// detailed information?
// tag overview/manager - list of all tags + editor in the bottom part
// complex filtering? - results on the left, most likely in a separate component
// version history, if that's ever a thing
export default class SidebarRight extends React.Component {

  render() {
    return (
      <div id="snovy-bar-right">
        <div className="sidebar-inner-content">
          <TagManager/>
        </div>
        <TabSwitcher position={Position.RIGHT}/>
      </div>
    )
  }

}