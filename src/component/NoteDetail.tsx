import React, {useEffect} from "react"
import Tag from "../model/coloured/Tag"
import {TagItem, TagItemScoped} from "./tag/TagItem"
import Scope from "../model/coloured/Scope"
import Notebook from "../model/Notebook"
import TagNoteForm from "./tag/TagNoteForm"
import Note from "../model/Note"
import {useDefaultEmpty} from "../Hooks"

const NoteDetail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  const [unscopedTags, setUnscopedTags] = useDefaultEmpty<Tag>()
  const [scoopedTags, setScopedTags] = useDefaultEmpty<[Scope, Array<Tag>]>()

  useEffect(
    () => {
      setUnscopedTags(props.note.unscopedTags)
      setScopedTags(Array.from(props.note.scopedTags.entries()))
    }, [props.note, props.note.tags]
  )

  const onRemove = (tag: Tag) => {
    props.note.untag(tag)
    setUnscopedTags(props.note.unscopedTags)
  }

  const onRemoveScoped = (tags: Array<Tag>) => {
    props.note?.untagAll(tags)
    setScopedTags(Array.from(props.note.scopedTags.entries()))
  }

  const onTag = (tag: Tag) => {
    props.note!.tag(tag)
    setUnscopedTags(props.note.unscopedTags)
    setScopedTags(Array.from(props.note.scopedTags.entries()))
  }

  return (
    <div id="snovy-note-detail">
      <TagNoteForm tags={props.notebook.sets.availableTags(props.note)} onTag={onTag}/>
      <div id="snovy-tag-display">
        {scoopedTags.map(([scope, tags]: [Scope, Tag[]]) =>
          <TagItemScoped
            key={scope.name} scope={scope} mapped={tags} onRemove={onRemove}
            onRemoveScope={onRemoveScoped}
          />
        )
        }
        {unscopedTags.map((item: Tag) =>
          <TagItem key={item.toString()} mapped={item} onRemove={onRemove}/>)
        }
      </div>
    </div>
  )

}

export default NoteDetail

