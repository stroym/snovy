import React from "react"
import SidebarContent from "../SidebarContent"
import {GenericItem} from "../../../util/types"
import List from "../../list/List"

export interface FavoritesProps<T extends GenericItem> extends React.HTMLProps<HTMLDivElement> {
  items: Array<T> | undefined
}

export const Favorites = <T extends GenericItem>({items}: FavoritesProps<T>) => {

  return (
    <SidebarContent id="favorites-view">
      <List items={[]} onSelect={_ => false} selection={[]} options={{preset: "simple"}}/>
    </SidebarContent>
  )

}

export default Favorites