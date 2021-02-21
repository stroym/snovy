import React from "react"
import Tag from "../../../data/model/colored/Tag"
import List from "../../list/List"
import Notebook from "../../../data/model/Notebook"

const TagManager = (props: {
  notebook: Notebook | undefined,
  tag: Tag | undefined,
  onTagChange: (tag: Tag | undefined) => void
}) => {

  return (
    <div id="snovy-tag-manager">
      <List<Tag> items={props.notebook?.sets.tags}
      />
    </div>
  )

}

export default TagManager