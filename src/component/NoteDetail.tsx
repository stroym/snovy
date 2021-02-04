import React, {useContext, useState} from "react"
import Tag from "../model/coloured/Tag"
import {NoteContext} from "../Context"
import {TagItem, TagItemScoped} from "./tag/TagItem"
import Scope from "../model/coloured/Scope"

const NoteDetail = () => {

  const noteContext = useContext(NoteContext)

  if (!noteContext) {
    return null
  }

  //TODO find a better way to update this component
  const [, setUpdated] = useState<string>()

  const onRemove = (tag: Tag) => {
    setUpdated(tag.toString())
    noteContext.activeNote?.untag(tag)
  }

  const onRemoveScoped = (tags: Array<Tag>) => {
    setUpdated(tags[0].scope!.name)
    noteContext.activeNote?.untagAll(tags)
  }

  //TODO make it a grid or something
  //TODO new tag picker (checkbox scope, input && colour picker scope && exclusive checkbox || parse single input
  // - might be nice to provide both as an option down the line), input && colour picker tag)
  // also: something fancier would be nice for scoped tags
  return (
    <div id="snovy-note-detail">
      {/*<TagNoteForm/>*/}
      <div id="snovy-tag-display">
        {noteContext.activeNote && Array.from(noteContext.activeNote.scopedTags.entries())
          .map(([scope, tags]: [Scope, Tag[]]) =>
            <TagItemScoped key={scope.name} scope={scope} mapped={tags} onRemove={onRemove}
                           onRemoveParent={onRemoveScoped}
            />
          )
        }
        {noteContext.activeNote?.unscopedTags.map((item: Tag) =>
          <TagItem key={item.toString()} mapped={item} onRemove={onRemove}/>)
        }
      </div>
    </div>
  )

}

export default NoteDetail

