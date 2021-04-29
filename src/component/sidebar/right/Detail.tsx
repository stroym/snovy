import React, {useEffect, useRef, useState} from "react"
import Tag from "../../../data/model/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/Scope"
import Notebook from "../../../data/model/Notebook"
import Note from "../../../data/model/Note"
import {dexie} from "../../../index"
import {title} from "../../../data/Database"
import {ToggleButton} from "../../inputs/Button"
import {watchOutsideClick} from "../../../util/hooks"
import TagForm from "../../tag/TagForm"
import SidebarContent from "../SidebarContent"
import ComboBox from "../../combo_box/ComboBox"
import TagDisplayItem from "../../tag/TagDisplayItem"

const Detail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  const [refresh, setRefresh] = useState(false)

  useEffect(
    () => {
      refreshTags()
    }, [props.note, props.note.tags]
  )

  const remove = async (tag: Tag | Array<Tag>) => {
    await props.note.untag(tag)
    refreshTags()
  }

  const refreshTags = () => {
    setRefresh(!refresh)
  }

  const onTag = async (tag: Tag | undefined) => {
    if (tag) {
      if (tag.scope && tag.scope.unique) {
        const uniqueScoped = props.note.tags.find(it => it.scope?.id == tag.scope!.id)

        if (uniqueScoped) {
          if ((confirm(`This scope is unique. Do you wish to replace the currently present tag ${uniqueScoped.title}?`))) {
            await props.note.untag(uniqueScoped)
            await props.note.tag(tag)
          }
        } else {
          await props.note.tag(tag)
        }
      } else {
        await props.note.tag(tag)
      }

      refreshTags()
    }
  }

  const tagCreation = async (tagText: string, tagColor: string, scope?: { title: string, color: string, unique: boolean }) => {
    let tag

    if (scope) {
      const dbScope =
        await dexie.scopes.where(title).equals(scope.title).first() ??
        await new Scope(props.notebook.id, scope.title, scope.color, scope.unique).save()

      tag = await new Tag(props.notebook.id, tagText, tagColor, dbScope.id).save()
    } else {
      tag = await new Tag(props.notebook.id, tagText, tagColor).save()
    }

    await props.note.tag(tag)
    await props.notebook.load()
    refreshTags()
    flipForm()
  }

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [formVisible, setFormVisible, flipForm] = watchOutsideClick(formRef, {otherRefs: [buttonRef]})
  const [menuVisible, setMenuVisible] = useState(false)
  const [inputValue, setInputValue] = useState("")

  useEffect(
    () => {
      if (!formVisible) {
        setInputValue("")
      }
    }, [formVisible]
  )

  const toggle = () => {
    setMenuVisible(!menuVisible)
    flipForm()
  }

  const getInputValue = (value: string) => {
    setInputValue(value)
    !formVisible && toggle()
  }

  return (
    <SidebarContent
      id="snovy-note-detail"
      heading={
        <>
          <ToggleButton preset="add" circular ref={buttonRef} onClick={toggle} setState={formVisible}/>
          <ComboBox<Tag>
            items={props.notebook.availableTags(props.note)} newItem={{getInputValue: getInputValue, name: "tag"}}
            options={{selectPreviousOnEsc: false, resetInputOnSelect: true, unboundDropdown: true}} onSelect={onTag}
            externalClose={{menuVisible: setMenuVisible, closeMenu: menuVisible}}
            onFocus={() => {setFormVisible(false)}}
            customItem={item => <TagDisplayItem tag={item}/>}
          />
        </>
      }
    >
      {
        formVisible &&
        <TagForm ref={formRef} scopes={props.notebook.scopes} initialValue={inputValue} onConfirm={tagCreation}/>
      }
      {
        props.note.tagMap.map(([scope, tags]: [Scope | undefined, Tag[]]) => scope ? scope.unique ?
          <TagItemScopedUnique key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
          <TagItemScoped key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
          tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>)
        )
      }
    </SidebarContent>
  )

}

export default Detail

