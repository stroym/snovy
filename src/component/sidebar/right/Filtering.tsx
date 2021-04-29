import React from "react"
import SidebarContent from "../SidebarContent"
import List from "../../list/List"

export const Filtering = () => {

  return (
    <SidebarContent id="filter-view">
      <List items={[]} onSelect={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Filtering