import React, {useState} from "react"
import Tag from "../model/coloured/Tag"
import {TagItem, TagItemScoped} from "./tag/TagItem"
import Scope from "../model/coloured/Scope"
import Notebook from "../model/Notebook"
import TagNoteForm from "./tag/TagNoteForm"
import Note from "../model/Note"

const NoteDetail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  const [change, flip] = useState(false)

  const onRemove = (tag: Tag) => {
    props.note?.untag(tag)
    flip(!change)
  }

  const onRemoveScoped = (tags: Array<Tag>) => {
    props.note?.untagAll(tags)
    flip(!change)
  }

  return (
    <div id="snovy-note-detail">
      <TagNoteForm note={props.note} notebook={props.notebook} onUpdate={() => flip(!change)}/>
      <div id="snovy-tag-display">
        {Array.from(props.note.scopedTags.entries())
          .map(([scope, tags]: [Scope, Tag[]]) =>
            <TagItemScoped
              key={scope.name} scope={scope} mapped={tags} onRemove={onRemove}
              onRemoveParent={onRemoveScoped}
            />
          )
        }
        {props.note.unscopedTags.map((item: Tag) =>
          <TagItem key={item.toString()} mapped={item} onRemove={onRemove}/>)
        }
      </div>
    </div>
  )

}

export default NoteDetail

