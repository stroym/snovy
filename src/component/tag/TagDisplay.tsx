import React from "react"
import Tag from "../../model/Tag"
import TagItem from "./TagItem"

const TagDisplay = (props: {
  tags: Array<Tag> | undefined
}) => {

  //TODO a way for adding new/existing tags (input/context/+ button)
  return (
    <div id="snovy-tag-display">
      {props.tags?.map((item: Tag) =>
        <TagItem key={item.id} mapped={item}/>)
      }
    </div>
  )

}

export default TagDisplay