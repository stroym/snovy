import React, {useEffect, useState} from "react"
import Tag from "../../../data/model/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/Scope"
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

  const remove = (tag: Tag | Array<Tag>) => {
    props.note.untag(tag)
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
      const maybeScope = props.notebook.scopes.find(it => it.title == scopeText)

      if (maybeScope) {
        tag = props.notebook.addTag(tagText, tagColor, maybeScope)
      } else {
        const scope = props.notebook.addScope(scopeText, scopeColor, scopeExclusive)
        tag = props.notebook.addTag(tagText, tagColor, scope)
      }
    } else {
      tag = props.notebook.addTag(tagText, tagColor)
    }

    props.note.tag(tag)
    refreshTags()
  }

  return (
    <div id="snovy-note-detail">
      <TagComboBox
        notebook={props.notebook}
        tags={props.notebook.availableTags(props.note)} scopes={props.notebook.scopes} onTag={onTag}
        onNewTag={tagCreation}
      />
      <div id="tag-display-area">
        {props.note.tagMap.map(([scope, tags]: [Scope | undefined, Tag[]]) => scope ? scope.unique ?
          <TagItemScopedUnique key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
          <TagItemScoped key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
          tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>)
        )}
      </div>
    </div>
  )

}

export default NoteDetail

