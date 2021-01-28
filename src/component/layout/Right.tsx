import React, {useState} from "react"
import TabMenu, {Orientation} from "../tab_menu/TabMenu"
import Notebook from "../../model/Notebook"
import Tag from "../../model/Tag"
import Sidebar from "./Sidebar"
import TagManager from "../tag/TagManager"
import TagDisplay from "../tag/TagDisplay"

const SidebarRight = (props: {
  activeNotebook: Notebook | undefined,
  activeTag: Tag | undefined,
  onActiveTagChange: (tag: Tag | undefined) => any
}) => {

  const [activeTab, setActiveTab] = useState<string | undefined>()

  const onTabClick = (active: string | undefined) => {
    setActiveTab(active)
  }

  return (
    <Sidebar orientation={Orientation.RIGHT}
             tabs={<TabMenu orientation={Orientation.RIGHT} onClick={onTabClick}
                            tabs={[
                              {text: "Note Tags", default: true},
                              {text: "Tag Manager"},
                              {text: "Filtering Options"},
                              {text: "Note Details"}
                            ]}
             />}
    >
      {activeTab == "Note Tags" && <TagDisplay/> ||
      activeTab == "Tag Manager" && <TagManager activeNotebook={props.activeNotebook} activeTag={props.activeTag}
                                                onActiveTagChange={props.onActiveTagChange}/>}
    </Sidebar>
  )

}

export default SidebarRight