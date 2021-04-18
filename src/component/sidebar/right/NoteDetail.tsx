import React, {useEffect, useRef, useState} from "react"
import Tag from "../../../data/model/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/Scope"
import Notebook from "../../../data/model/Notebook"
import Note from "../../../data/model/Note"
import {dexie} from "../../../index"
import {title} from "../../../data/Database"
import {ToggleButton} from "../../inputs/Button"
import {useHideOnOutsideClick} from "../../../util/Hooks"
import TagForm from "../../tag/TagForm"
import ComboBox from "../../combo_box/ComboBox"
import {useTheme} from "@emotion/react"

const NoteDetail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  const theme = useTheme()

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

  const refreshTags = () => {
    setRefresh(!refresh)
  }

  const onTag = (tag: Tag | undefined) => {
    if (tag) {
      if (tag.scope && tag.scope.unique) {
        const uniqueScoped = props.note.tags.find(it => it.scope?.id == tag.scope!.id)

        if (uniqueScoped) {
          //TODO custom pop-up
          if ((confirm(`This scope is unique. Do you wish to replace the currently present tag ${uniqueScoped.title}?`))) {
            props.note.untag(uniqueScoped)
            props.note.tag(tag)
          }
        } else {
          props.note.tag(tag)
        }
      } else {
        props.note.tag(tag)
      }

      refreshTags()
    }
  }

  const tagCreation = async (tagText: string, tagColor: string, scopeText?: string, scopeColor?: string, scopeUnique?: boolean) => {
    let tag

    if (scopeText && scopeColor && scopeUnique) {
      const maybeScope = await dexie.scopes.where(title).equals(scopeText).first()

      if (maybeScope) {
        tag = new Tag(props.notebook.id, tagText, tagColor, maybeScope.id)

        //add to scope

      } else {
        const scope = await new Scope(props.notebook.id, scopeText, scopeColor, scopeUnique).save()
        tag = new Tag(props.notebook.id, tagText, tagColor, scope.id)
      }
    } else {
      tag = new Tag(props.notebook.id, tagText, tagColor)
    }

    await tag.save()

    props.note.tag(await tag.load())
    await props.notebook.load()
    refreshTags()
    flipForm()
  }

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [formVisible, setFormVisible, flipForm] = useHideOnOutsideClick(formRef, {otherRefs: [buttonRef]})
  const [menuVisible, setMenuVisible] = useState(false)
  const [inputValue, setInputValue] = useState("")

  useEffect(
    () => {
      if (!formVisible) {
        setInputValue("")
      }
    }, [formVisible]
  )

  const flip = () => {
    setMenuVisible(!menuVisible)
    flipForm()
  }

  const getInputValue = (value: string) => {
    setInputValue(value)
    !formVisible && flip()
  }

  return (
    <div id="snovy-note-detail">
      <div className="note-detail-header">
        <ToggleButton preset="add" ref={buttonRef} onClick={flip} setState={formVisible}/>
        <ComboBox
          items={props.notebook.availableTags(props.note)} newItem={{getInputValue: getInputValue, name: "tag"}}
          options={{selectPreviousOnEsc: false, resetInputOnSelect: true, unboundDropdown: true}} onItemSelect={onTag}
          externalClose={{menuVisible: setMenuVisible, closeMenu: menuVisible}} onFocus={() => {setFormVisible(false)}}
          style={{backgroundColor: theme.primary, color: theme.textPrimary}}
          itemColors={{selected: theme.activeItem, highlight: theme.hover}}
        />
      </div>
      <div className="note-detail-body">
        {formVisible &&
        <TagForm ref={formRef} scopes={props.notebook.scopes} initialValue={inputValue} onConfirm={tagCreation}/>
        }
        <div id="tag-display-area" tabIndex={-1}>
          {props.note.tagMap.map(([scope, tags]: [Scope | undefined, Tag[]]) => scope ? scope.unique ?
            <TagItemScopedUnique key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
            <TagItemScoped key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
            tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>)
          )}
        </div>
      </div>
    </div>
  )

}

export default NoteDetail

