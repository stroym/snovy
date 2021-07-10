import React, {useContext, useState} from "react"
import SidebarContent from "../SidebarContent"
import TabMenu, {Orientation} from "../../tab_menu/TabMenu"
import List from "../../list/List"
import TabMenuItem from "../../tab_menu/TabMenuItem"
import AppContext from "../../../util/AppContext"
import {useDefaultEmpty} from "../../../util/hooks"
import State from "../../../data/model/State"
import Tag from "../../../data/model/Tag"
import Scope from "../../../data/model/Scope"

const Manager = () => {

  const appContext = useContext(AppContext)

  const mappings = {
    tags: "Tags",
    scopes: "Scopes",
    states: "States"
  }

  const [active, setActive] = useState(mappings.tags)
  const [currentItems, setCurrentItems] = useDefaultEmpty<Tag | Scope | State>()

  const activateTab = (text: string, items: Array<Tag | Scope | State>) => {
    setActive(text)
    setCurrentItems(items)
  }

  return (
    <SidebarContent
      id="manager-view"
      heading={
        <TabMenu orientation={Orientation.TOP} noSection>
          <TabMenuItem
            viewable={{
              text: mappings.tags,
              active: active,
              onActiveChange: text => activateTab(text, appContext.tags)
            }}
          />
          <TabMenuItem
            viewable={{
              text: mappings.scopes,
              active: active,
              onActiveChange: text => activateTab(text, appContext.scopes)
            }}
          />
          <TabMenuItem
            viewable={{
              text: mappings.states,
              active: active,
              onActiveChange: text => activateTab(text, appContext.states)
            }}
          />
        </TabMenu>
      }
    >
      <List items={currentItems} onSelectionChange={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Manager