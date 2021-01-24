import React, {useState} from "react"
import Note from "../../model/Note"
import Tag from "../../model/Tag"
import List from "../list/List"

const TagManager = (props: {
  activeNote: Note | undefined
}) => {

  const [activeContext, setActiveContext] = useState<Tag | undefined>()

  return (
    <div id="snovy-tag-manager">
      <List<Tag> items={props.activeNote?.tagsArray}
                 onActiveChange={() => {}}
                 onContextChange={(target: any) => {setActiveContext(target)}}
      />
    </div>
  )

}

export default TagManager