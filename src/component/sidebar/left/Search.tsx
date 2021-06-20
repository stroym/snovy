import React, {useContext, useState} from "react"
import SidebarContent from "../SidebarContent"
import List from "../../list/List"
import AppContext from "../../../util/AppContext"
import TabMenu, {Orientation} from "../../tab_menu/TabMenu"
import TabMenuItem from "../../tab_menu/TabMenuItem"
import WithLabel from "../../inputs/WithLabel"
import Input from "../../inputs/Input"
import {sortTags} from "../../../data/model/Tag"
import TagDisplayItem from "../../tag/TagDisplayItem"
import {Button} from "../../inputs/Button"

const Search = () => {

  const appContext = useContext(AppContext)

  const mappings = {
    filters: "Filters",
    results: "Results"
  }

  const [active, setActive] = useState(mappings.filters)

  return (
    <SidebarContent
      id="search-view"
      heading={
        <TabMenu orientation={Orientation.TOP} noSection>
          <TabMenuItem viewable={{text: mappings.filters, active: active, onActiveChange: setActive}}/>
          <TabMenuItem viewable={{text: mappings.results, active: active, onActiveChange: setActive}}/>
        </TabMenu>
      }
    >
      <form
        className="snovy-form" tabIndex={-1}
        style={{
          display: active != mappings.filters ? "none" : "initial",
          visibility: active != mappings.filters ? "hidden" : "visible"
        }}
      >
        <WithLabel value="Text" position="before">
          <Input/>
        </WithLabel>
        States
        <List items={appContext.states}/>
        Tags
        <List items={sortTags(appContext.tags)} customItem={item => <TagDisplayItem tag={item}/>}/>
        <Button>Search</Button>
      </form>
      <List
        items={[]} onSelectionChange={_ => false} selection={[]} options={{preset: "simple"}}
        style={{
          display: active != mappings.results ? "none" : "initial",
          visibility: active != mappings.results ? "hidden" : "visible"
        }}
      />
    </SidebarContent>
  )

}

export default Search