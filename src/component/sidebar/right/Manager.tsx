import React, {useState} from "react"
import SidebarContent from "../SidebarContent"
import TabMenu, {Orientation} from "../../tab_menu/TabMenu"
import List from "../../list/List"
import TabMenuItem from "../../tab_menu/TabMenuItem"

const Manager = () => {

  const mappings = {
    tags: "Tags",
    scopes: "Scopes",
    states: "States"
  }

  const [active, setActive] = useState(mappings.tags)

  return (
    <SidebarContent
      id="manager-view"
      heading={
        <TabMenu orientation={Orientation.TOP} noSection>
          <TabMenuItem viewable={{text: mappings.tags, active: active, onActiveChange: setActive}}/>
          <TabMenuItem viewable={{text: mappings.scopes, active: active, onActiveChange: setActive}}/>
          <TabMenuItem viewable={{text: mappings.states, active: active, onActiveChange: setActive}}/>
        </TabMenu>
      }
    >
      <List items={[]} onSelectionChange={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Manager