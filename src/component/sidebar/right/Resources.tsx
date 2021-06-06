import React from "react"
import SidebarContent from "../SidebarContent"
import {GenericItem} from "../../../util/types"

export interface ResourcesProps<T extends GenericItem> extends React.HTMLProps<HTMLDivElement> {
  item: T | undefined
}

const Resources = <T extends GenericItem>() => {

  return (
    <SidebarContent id="resources-view">
      {/*<List items={items} onSelect={blob => {}} selection={[]} options={{preset: "simple"}}/>*/}
    </SidebarContent>
  )

}

export default Resources