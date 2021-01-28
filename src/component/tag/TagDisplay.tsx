import React, {useEffect, useState} from "react"
import Tag from "../../model/Tag"
import TagItem from "./TagItem"
import Note from "../../model/Note"

const TagDisplay = (props: {
  activeNote: Note | undefined
}) => {

  if (!props.activeNote) {
    return null
  }

  //TODO find a better way to update this component
  const [updated, setUpdated] = useState<number>()

  useEffect(
    () => {
      console.log(props.activeNote)
    }, [props.activeNote]
  )

  const onRemove = (tag: Tag) => {
    setUpdated(tag.id)
    props.activeNote!.untag(tag)
  }

  //TODO a way for adding new/existing tags (input/context/+ button)
  return (
    <div id="snovy-tag-display">
      {Array.from(props.activeNote.tagsSortedAlphabetically).map((item: Tag) =>
        <TagItem key={item.id} mapped={item} onRemove={onRemove}/>)
      }
    </div>
  )

}

export default TagDisplay