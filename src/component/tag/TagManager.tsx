import React, {useState} from "react"
import Tag from "../../model/coloured/Tag"
import List from "../list/List"
import Notebook from "../../model/Notebook"
import ContextMenuItem from "../context_menu/ContextMenuItem"

const TagManager = (props: {
  activeNotebook: Notebook | undefined,
  activeTag: Tag | undefined,
  onActiveTagChange: (tag: Tag | undefined) => any
}) => {

  const [activeContext, setActiveContext] = useState<Tag | undefined>()

  return (
    <div id="snovy-tag-manager">
      <List<Tag> items={props.activeNotebook?.tags}
                 onActiveChange={() => {}}
                 onContextChange={(target: any) => {setActiveContext(target)}}
                 contextChildren={
                   props.activeNotebook ? [
                     <ContextMenuItem key={"new"} text={"new"} onClick={() => { props.activeNotebook!.addTag()}}/>,
                     ...activeContext ? [
                       <ContextMenuItem key={"delete"} text={"delete"} onClick={() => {
                         props.activeNotebook?.deleteTag(activeContext)

                         if (props.activeTag == activeContext) {
                           props.onActiveTagChange(undefined)
                         }
                       }
                       }/>
                     ] : []
                   ] : undefined
                 }
      />
    </div>
  )

}

export default TagManager