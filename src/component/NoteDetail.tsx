import React, {useEffect} from "react"
import Tag from "../model/coloured/Tag"
import {TagItem, TagItemScoped} from "./tag/TagItem"
import Scope from "../model/coloured/Scope"
import Notebook from "../model/Notebook"
import Note from "../model/Note"
import {useDefaultEmpty} from "../util/Hooks"
import TagComboBox from "./tag/TagComboBox"

const NoteDetail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  //TODO probably wouldn't hurt to somehow get all of this in one field... maybe custom holder on note? - or maybe go back to flicking a boolean
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

  const tagCreation = (tagText: string, tagColour: string, scopeText: string, scopeColour: string, scopeExclusive: boolean) => {
    let tag

    if (scopeText) {
      const maybeScope = props.notebook.sets.scopes.find(it => it.name == scopeText)

      if (maybeScope) {
        tag = props.notebook.sets.addTag(tagText, tagColour, maybeScope)
      } else {
        const scope = props.notebook.sets.addScope(scopeText, scopeColour, scopeExclusive)
        tag = props.notebook.sets.addTag(tagText, tagColour, scope)
      }
    } else {
      tag = props.notebook.sets.addTag(tagText, tagColour)
    }

    props.note.tag(tag)
    refreshTags()
  }

  return (
    <div id="snovy-note-detail">
      <TagComboBox tags={props.notebook.sets.availableTags(props.note)} onTag={onTag} onNewTag={tagCreation}/>
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

