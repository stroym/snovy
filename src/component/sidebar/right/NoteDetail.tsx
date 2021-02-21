import React, {useEffect, useState} from "react"
import Tag from "../../../data/model/colored/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/colored/Scope"
import Notebook from "../../../data/model/Notebook"
import Note from "../../../data/model/Note"
import TagComboBox from "../../tag/TagComboBox"

const NoteDetail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  const [refresh, setRefresh] = useState(false)

  useEffect(
    () => {
      refreshTags()
    }, [props.note, props.note.tags]
  )

  const remove = (tag: Tag) => {
    props.note.untag(tag)
    refreshTags()
  }

  const removeScoped = (tags: Array<Tag>) => {
    props.note?.untagAll(tags)
    refreshTags()
  }

  const onTag = (tag: Tag) => {
    props.note?.tag(tag)
    refreshTags()
  }

  const refreshTags = () => {
    setRefresh(!refresh)
  }

  const tagCreation = (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeExclusive: boolean) => {
    let tag

    if (scopeText) {
      const maybeScope = props.notebook.sets.scopes.find(it => it.title == scopeText)

      if (maybeScope) {
        tag = props.notebook.sets.addTag(tagText, tagColor, maybeScope)
      } else {
        const scope = props.notebook.sets.addScope(scopeText, scopeColor, scopeExclusive)
        tag = props.notebook.sets.addTag(tagText, tagColor, scope)
      }
    } else {
      tag = props.notebook.sets.addTag(tagText, tagColor)
    }

    props.note.tag(tag)
    refreshTags()
  }

  return (
    <div id="snovy-note-detail">
      <TagComboBox tags={props.notebook.sets.availableTags(props.note)} onTag={onTag} onNewTag={tagCreation}/>
      <div id="snovy-tag-display">
        {props.note.tagMap.map(([scope, tags]: [Scope | undefined, Tag[]]) => scope ? scope.unique ?
          <TagItemScopedUnique
            key={scope.title} scope={scope} mapped={tags} onRemove={remove} onRemoveScope={removeScoped}
          /> :
          <TagItemScoped
            key={scope.title} scope={scope} mapped={tags} onRemove={remove} onRemoveScope={removeScoped}
          /> :
          tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>)
        )}
      </div>
    </div>
  )

}

export default NoteDetail

