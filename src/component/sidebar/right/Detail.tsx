import React, {useContext, useEffect, useRef, useState} from "react"
import Tag from "../../../data/model/Tag"
import {TagItem, TagItemScoped, TagItemScopedUnique} from "../../tag/TagItem"
import Scope from "../../../data/model/Scope"
import Note from "../../../data/model/Note"
import {ToggleButton} from "../../inputs/Button"
import {useDefaultEmpty, watchOutsideClick} from "../../../util/hooks"
import TagForm from "../../tag/TagForm"
import SidebarContent from "../SidebarContent"
import ComboBox from "../../combo_box/ComboBox"
import TagDisplayItem from "../../tag/TagDisplayItem"
import {Titled} from "../../../data/model/Base"
import AppContext from "../../../util/AppContext"

const Detail = () => {

  const appContext = useContext(AppContext)

  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [noteTags, setNoteTags] = useDefaultEmpty<Tag>()

  const [formVisible, setFormVisible, flipForm] = watchOutsideClick(formRef, {
    otherRefs: [buttonRef],
    onToggleOff: () => setInputValue("")
  })
  const [inputValue, setInputValue] = useState("")

  useEffect(
    () => {
      refreshTags()
    }, [appContext.activeNote, appContext.tags]
  )

  const getInputValue = (value: string) => {
    setInputValue(value)
    !formVisible && flipForm()
  }

  const availableTags = () => {
    const tagsNotOnNote = appContext.tags.filter(it => !noteTags.includes(it))
    const scopedTags: Array<Tag> = []
    const unscopedTags: Array<Tag> = []

    tagsNotOnNote.forEach(it => it.scope ? scopedTags.push(it) : unscopedTags.push(it))
    scopedTags.sort(Tag.compareByScopeUnique || Tag.compareByScope || Tag.compareByTitle)
    unscopedTags.sort(Titled.compareByTitle)

    return scopedTags.concat(unscopedTags)
  }

  const collectNoteTags = () => {
    const scopedTags: Array<Tag> = []
    const unscopedTags: Array<Tag> = []

    noteTags.forEach(it => it.scope ? scopedTags.push(it) : unscopedTags.push(it))

    scopedTags.sort(Tag.compareByScopeUnique)

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

  const refreshTags = () => {
    setNoteTags(appContext.tags.filter(it => appContext.activeNote?.tagIds.includes(it.id)))
  }

  const onTag = async (note: Note | undefined, tag: Tag | undefined) => {
    if (note && tag) {
      if (tag.scope && tag.scope.unique) {
        const uniqueScoped = noteTags.find(it => it.scope?.id == tag.scope!.id)

        if (uniqueScoped) {
          if ((confirm(`This scope is unique. Do you wish to replace the currently present tag ${uniqueScoped.title}?`))) {
            await note.untag(uniqueScoped)
            await note.tag(tag)
          }
        } else {
          await note.tag(tag)
        }
      } else {
        await note.tag(tag)
      }

      refreshTags()
    }
  }

  return (
    <SidebarContent
      id="snovy-note-detail"
      heading={
        <>
          <ToggleButton preset="add" circular ref={buttonRef} onClick={flipForm} setState={formVisible}/>
          <ComboBox<Tag>
            items={availableTags()} newItem={{getInputValue: getInputValue, name: "tag"}}
            options={{selectPreviousOnEsc: false, resetInputOnSelect: true, unboundDropdown: true}}
            onSelect={tag => onTag(appContext.activeNote, tag)}
            onFocus={() => {setFormVisible(false)}}
            customItem={item => <TagDisplayItem tag={item}/>}
          />
        </>
      }
    >
      {
        formVisible &&
        <TagForm
          ref={formRef} scopes={appContext.scopes} initialValue={inputValue}
          onTagCreated={tag => {
            flipForm()
            onTag(appContext.activeNote, tag)  //TODO this should only happen when create & tag is used
          }}
        />
      }
      {
        appContext.activeNote && mapTagsToTagItems(
          collectNoteTags(),
          async (tag: Tag | Array<Tag>) => {
            await appContext.activeNote!.untag(tag)
            refreshTags()
          })
      }
    </SidebarContent>
  )

}

const mapTagsToTagItems = (tags: Array<[Scope | undefined, Tag[]]>, remove: (tag: Tag | Array<Tag>) => void) => {
  return tags.map(([scope, tags]: [Scope | undefined, Tag[]]) => scope ? scope.unique ?
    <TagItemScopedUnique key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
    <TagItemScoped key={scope.title} scope={scope} mapped={tags} onRemove={remove}/> :
    tags.map((item: Tag) => <TagItem key={item.toString()} mapped={item} onRemove={remove}/>)
  )
}

export default Detail

