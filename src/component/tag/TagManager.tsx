import React, {useState} from "react"
import Tag from "../../model/Tag"
import List from "../list/List"
import {Action} from "../context_menu/ContextMenu"
import Notebook from "../../model/Notebook"

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
                 contextActions={
                   props.activeNotebook ? [
                     new Action("new", () => {
                       props.activeNotebook!.addTag()
                     }),
                     ...activeContext ? [
                       new Action("delete", () => {
                         props.activeNotebook?.deleteTagById(activeContext.id)

                         if (props.activeTag == activeContext) {
                           props.onActiveTagChange(undefined)
                         }
                       })
                     ] : []
                   ] : undefined
                 }
      />
    </div>
  )

}

export default TagManager