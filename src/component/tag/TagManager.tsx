import React, {useState} from "react"
import Tag from "../../model/coloured/Tag"
import List from "../list/List"
import Notebook from "../../model/Notebook"
import ContextMenuItem from "../context_menu/ContextMenuItem"

const TagManager = (props: {
  activeNotebook: Notebook | undefined,
  activeTag: Tag | undefined,
  onActiveChange: (tag: Tag | undefined) => any
}) => {

  const [activeContext, setActiveContext] = useState<Tag | undefined>()

  return (
    <div id="snovy-tag-manager">
      <List<Tag> items={props.activeNotebook?.sets.tags}
                 onActiveChange={() => {}}
                 onContextChange={(target: any) => {setActiveContext(target)}}
                 contextChildren={
                   props.activeNotebook ? [
                     <ContextMenuItem key={"new"} text={"new"}
                                      onClick={() => { props.activeNotebook!.sets.addTag("", "")}}/>,
                     ...activeContext ? [
                       <ContextMenuItem key={"delete"} text={"delete"} onClick={() => {
                         props.activeNotebook?.sets.deleteTag(activeContext)

                         if (props.activeTag == activeContext) {
                           props.onActiveChange(undefined)
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