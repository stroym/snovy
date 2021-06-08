import React from "react"
import SidebarContent from "../SidebarContent"
import List from "../../list/List"

export const Favorites = () => {

  return (
    <SidebarContent id="favorites-view">
      <List
        items={["asdasd", "asda", "bgsfg", "sffsdf"]} onSelectionChange={_ => false} selection={[]}
        options={{preset: "simple"}}
      />
    </SidebarContent>
  )

}

export default Favorites