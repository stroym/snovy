import React from "react"
import SidebarContent from "../SidebarContent"
import List from "../../list/List"

export const Archive = () => {

  return (
    <SidebarContent id="archive-view">
      <List items={[]} onSelect={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Archive