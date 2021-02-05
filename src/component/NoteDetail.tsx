import React, {useContext, useState} from "react"
import Tag from "../model/coloured/Tag"
import {NoteContext} from "../Context"
import {TagItem, TagItemScoped} from "./tag/TagItem"
import Scope from "../model/coloured/Scope"
import Notebook from "../model/Notebook"
import TagNoteForm from "./tag/TagNoteForm"

const NoteDetail = (props: {
  activeNotebook: Notebook | undefined
}) => {

  const noteContext = useContext(NoteContext)

  const [change, flip] = useState(false)

  const onRemove = (tag: Tag) => {
    noteContext?.activeNote?.untag(tag)
    flip(!change)
  }

  const onRemoveScoped = (tags: Array<Tag>) => {
    noteContext?.activeNote?.untagAll(tags)
    flip(!change)
  }

  return (
    <div id="snovy-note-detail">
      <TagNoteForm notebook={props.activeNotebook} onUpdate={() => flip(!change)}/>
      {noteContext && noteContext.activeNote &&
      <div id="snovy-tag-display">
        {Array.from(noteContext.activeNote.scopedTags.entries())
          .map(([scope, tags]: [Scope, Tag[]]) =>
            <TagItemScoped
              key={scope.name} scope={scope} mapped={tags} onRemove={onRemove}
              onRemoveParent={onRemoveScoped}
            />
          )
        }
        {noteContext.activeNote.unscopedTags.map((item: Tag) =>
          <TagItem key={item.toString()} mapped={item} onRemove={onRemove}/>)
        }
      </div>
      }
    </div>
  )

}

export default NoteDetail

