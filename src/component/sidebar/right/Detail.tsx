import React, {useContext, useEffect, useRef, useState} from "react"
import Tag from "../../../data/model/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/Scope"
import Notebook from "../../../data/model/Notebook"
import Note from "../../../data/model/Note"
import {dexie} from "../../../index"
import {title} from "../../../data/Database"
import {ToggleButton} from "../../inputs/Button"
import {useDefaultEmpty, watchOutsideClick} from "../../../util/hooks"
import TagForm from "../../tag/TagForm"
import SidebarContent from "../SidebarContent"
import ComboBox from "../../combo_box/ComboBox"
import TagDisplayItem from "../../tag/TagDisplayItem"
import AppContext from "../../../util/AppContext"
import {Titled} from "../../../data/model/Base"

const Detail = (props: {
  note: Note,
  notebook: Notebook
}) => {

  const context = useContext(AppContext)

  const [noteTags, setNoteTags] = useDefaultEmpty<Tag>()

  useEffect(
    () => {
      refreshTags()
    }, [props.note, props.note.tagIds, context.tags]
  )

  const remove = async (tag: Tag | Array<Tag>) => {
    await props.note.untag(tag)
    refreshTags()
  }

  const refreshTags = () => {
    setNoteTags(context.tags.filter(it => props.note.tagIds.includes(it.id)))
  }

  const onTag = async (tag: Tag | undefined) => {
    if (tag) {
      if (tag.scope && tag.scope.unique) {
        const uniqueScoped = noteTags.find(it => it.scope?.id == tag.scope!.id)

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
        await new Scope(scope.title, scope.color, scope.unique).save()

      tag = await new Tag(tagText, tagColor, dbScope.id).save()
    } else {
      tag = await new Tag(tagText, tagColor).save()
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

  const availableTags = () => {
    const scopedTags: Array<Tag> = []
    const unscopedTags: Array<Tag> = []

    context.tags.forEach(it => it.scope ? scopedTags.push(it) : unscopedTags.push(it))

    //TODO try to move these comparators somewhere
    scopedTags.sort((a, b) => {
      return Number(a.scope?.unique) - Number(b.scope?.unique) || a.scope!.title.localeCompare(b.scope!.title) || a.title.localeCompare(b.title)
    })

    unscopedTags.sort(Titled.compareByTitle)

    return scopedTags.concat(unscopedTags)
  }

  const collectNoteTags = () => {
    const scopedTags: Array<Tag> = []
    const unscopedTags: Array<Tag> = []

    noteTags.forEach(it => it.scope ? scopedTags.push(it) : unscopedTags.push(it))

    scopedTags.sort(Tag.compareByExclusivity)

    //TODO try simplify this
    const tempId = new Map<number, Array<Tag>>()
    const temp = new Map<Scope | undefined, Array<Tag>>()

    scopedTags.forEach((tag) => {
      const scope = tag.scope!

      if (!tempId.has(scope.id)) {
        tempId.set(scope.id, [])
      }

      tempId.get(scope.id)!.push(tag)
    })

    Array.from(tempId.entries()).forEach(([_scopeId, tags]: [number, Tag[]]) => {
      temp.set(tags.first()!.scope!, tags)
    })

    temp.set(undefined, unscopedTags)

    return Array.from(temp.entries())
  }

  return (
    <SidebarContent
      id="snovy-note-detail"
      heading={
        <>
          <ToggleButton preset="add" circular ref={buttonRef} onClick={toggle} setState={formVisible}/>
          <ComboBox<Tag>
            items={availableTags()} newItem={{getInputValue: getInputValue, name: "tag"}}
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
        <TagForm ref={formRef} scopes={context.scopes} initialValue={inputValue} onConfirm={tagCreation}/>
      }
      {
        collectNoteTags().map(([scope, tags]: [Scope | undefined, Tag[]]) => scope ? scope.unique ?
          <TagItemScopedUnique key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
          <TagItemScoped key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
          tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>)
        )
      }
    </SidebarContent>
  )

}

export default Detail

