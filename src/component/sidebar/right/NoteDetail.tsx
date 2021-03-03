import React, {useEffect, useState} from "react"
import Tag from "../../../data/model/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/Scope"
import Notebook from "../../../data/model/Notebook"
import Note from "../../../data/model/Note"
import TagComboBox from "../../tag/TagComboBox"
import {dexie} from "../../../index"
import {title} from "../../../data/Database"

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

  //TODO as is, scope won't be visible until refresh - recheck behavior after decoupling
  const tagCreation = async (tagText: string, tagColor: string, scopeText: string, scopeColor: string, scopeUnique: boolean) => {
    let tag

    if (scopeText) {
      const maybeScope = await dexie.scopes.where(title).equals(scopeText).first()

      if (maybeScope) {
        tag = new Tag(props.notebook.id, tagText, tagColor, maybeScope.id)

      } else {
        const scope = await new Scope(props.notebook.id, scopeText, scopeColor, scopeUnique).save()
        tag = new Tag(props.notebook.id, tagText, tagColor, scope.id)
      }
    } else {
      tag = new Tag(props.notebook.id, tagText, tagColor)
    }

    await tag.save()

    props.note.tag(await tag.load())
    refreshTags()
  }

  return (
    <div id="snovy-note-detail">
      <TagComboBox
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

