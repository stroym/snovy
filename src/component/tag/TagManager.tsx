import React, {useState} from "react"
import Tag from "../../model/colored/Tag"
import List from "../list/List"
import Notebook from "../../model/Notebook"
import ContextMenuItem from "../context_menu/ContextMenuItem"

const TagManager = (props: {
  notebook: Notebook | undefined,
  tag: Tag | undefined,
  onTagChange: (tag: Tag | undefined) => void
}) => {

  const [activeContext, setActiveContext] = useState<Tag | undefined | null>()

  return (
    <div id="snovy-tag-manager">
      <List<Tag> items={props.notebook?.sets.tags}
                 onContextChange={(target: Tag | undefined | null) => {setActiveContext(target)}}
                 contextChildren={
                   props.notebook ? [
                     <ContextMenuItem
                       key={"new"} text={"new"}
                       onClick={() => { props.notebook!.sets.addTag("", "")}}
                     />,
                     ...activeContext ? [
                       <ContextMenuItem
                         key={"delete"} text={"delete"} onClick={() => {
                         props.notebook?.sets.deleteTag(activeContext)

                         if (props.tag == activeContext) {
                           props.onTagChange(undefined)
                         }
                       }
                       }
                       />
                     ] : []
                   ] : undefined
                 }
      />
    </div>
  )

}

export default TagManager