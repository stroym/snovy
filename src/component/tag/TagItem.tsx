import React from "react"
import Tag from "../../model/Tag"

const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => any
}) => {

  //TODO maybe, MAYBE, editable input... but since it needs to grow with content, it's probably not worth the hassle
  // yes, I could use a component that does that, but how useful would this really be here?
  // I mean, this is supposed to just display the tags, after all - if I really want editing here (in addition to manager)
  // it'd probably be much easier via a context menu & pop-up dialog
  return (
    <span className="snovy-tag-item">
      <div>{props.mapped.name}</div>
      <button onClick={() => props.onRemove(props.mapped)}>{"×"}</button>
    </span>
  )

}

export default TagItem