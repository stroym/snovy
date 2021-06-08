import React from "react"
import SidebarContent from "../SidebarContent"
import List from "../../list/List"
import ComboBox from "../../combo_box/ComboBox"

const Search = () => {

  return (
    <SidebarContent
      id="search-view"
      heading={
        <ComboBox items={[]}/>
      }
    >
      <List items={[]} onSelectionChange={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Search