import React, {useContext, useState} from "react"
import Tag from "../../model/Tag"
import TagItem from "./TagItem"
import {NoteContext} from "../../Context"

const TagDisplay = () => {

  const noteContext = useContext(NoteContext)

  if (!noteContext) {
    return null
  }

  //TODO find a better way to update this component
  const [updated, setUpdated] = useState<number>()

  // useEffect(
  //   () => {
  //     console.log(noteContext.activeNote)
  //   }, [noteContext.activeNote?.tags]
  // )

  const onRemove = (tag: Tag) => {
    setUpdated(tag.id)
    noteContext.activeNote?.untag(tag)
  }

  //TODO put state select above tags
  //TODO a way for adding new/existing tags (input/context/+ button)
  return (
    <div id="snovy-tag-display">
      {noteContext.activeNote?.tagsSortedAlphabetically.map((item: Tag) =>
        <TagItem key={item.id} mapped={item} onRemove={onRemove}/>)
      }
    </div>
  )

}

export default TagDisplay