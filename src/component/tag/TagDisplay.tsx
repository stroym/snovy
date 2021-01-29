import React, {useContext, useState} from "react"
import Tag from "../../model/Tag"
import {NoteContext} from "../../Context"
import {TagItem, TagItemGrouped} from "./TagItem"

const TagDisplay = () => {

  const noteContext = useContext(NoteContext)

  if (!noteContext) {
    return null
  }

  //TODO find a better way to update this component
  const [updated, setUpdated] = useState<string>()

  const onRemove = (tag: Tag) => {
    setUpdated(tag.toString())
    noteContext.activeNote?.untag(tag)
  }

  const onRemoveScoped = (tags: Array<Tag>) => {
    setUpdated(tags[0].scope!.name)
    noteContext.activeNote?.untagAll(tags)
  }

  //TODO put state select above tags
  //TODO a way for adding new/existing tags (input/context/+ button)
  return (
    <div id="snovy-tag-display">
      <div id="tag-display-container">
        {noteContext.activeNote && Array.from(noteContext.activeNote.scopedTags.entries())
          .map(([key, value]: [string, Tag[]]) =>
            <TagItemGrouped key={key} mapped={value} onRemove={onRemove} onRemoveParent={onRemoveScoped}/>
          )
        }
        {noteContext.activeNote?.unscopedTags.map((item: Tag) =>
          <TagItem key={item.toString()} mapped={item} onRemove={onRemove}/>)
        }
      </div>
      {/*<TagAddForm/>*/}
    </div>
  )

}

export default TagDisplay