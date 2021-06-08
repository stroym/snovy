import React from "react"
import SidebarContent from "../SidebarContent"
import List from "../../list/List"

const Filtering = () => {

  return (
    <SidebarContent id="filter-view">
      <List items={[]} onSelectionChange={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Filtering