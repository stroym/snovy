import React, {useEffect} from "react"
import Tag from "../model/coloured/Tag"
import {TagItem, TagItemScoped} from "./tag/TagItem"
import Scope from "../model/coloured/Scope"
import Notebook from "../model/Notebook"
import AddTagForm from "./tag/AddTagForm"
import Note from "../model/Note"
import {useDefaultEmpty} from "../Hooks"

const NoteDetail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  //TODO probably wouldn't hurt to somehow get all of this in one field... maybe custom holder on note?
  const [unscopedTags, setUnscopedTags] = useDefaultEmpty<Tag>()
  const [scoopedTags, setScopedTags] = useDefaultEmpty<[Scope, Array<Tag>]>()

  useEffect(
    () => {
      refreshTags()
    }, [props.note, props.note.tags]
  )

  const onRemove = (tag: Tag) => {
    props.note.untag(tag)
    refreshTags()
  }

  const onRemoveScoped = (tags: Array<Tag>) => {
    props.note?.untagAll(tags)
    refreshTags()
  }

  const onTag = (tag: Tag) => {
    props.note!.tag(tag)
    refreshTags()
  }

  const refreshTags = () => {
    setUnscopedTags(props.note.unscopedTags)
    setScopedTags(Array.from(props.note.scopedTags.entries()))
  }

  return (
    <div id="snovy-note-detail">
      <AddTagForm tags={props.notebook.sets.availableTags(props.note)} onTag={onTag}/>
      <div id="snovy-tag-display">
        {scoopedTags.map(([scope, tags]: [Scope, Tag[]]) =>
          <TagItemScoped
            key={scope.name} scope={scope} mapped={tags} onRemove={onRemove}
            onRemoveScope={onRemoveScoped}
          />
        )}
        {unscopedTags.map((item: Tag) =>
          <TagItem key={item.toString()} mapped={item} onRemove={onRemove}/>)
        }
      </div>
    </div>
  )

}

export default NoteDetail

