import React from "react"
import Tag from "../../model/coloured/Tag"
import {CollapseButton, RemoveButton} from "./Button"

export const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => any,
}) => {

  return (
    <span className="snovy-tag-item">
      <span className="tag-name"> {props.mapped.name}</span>
      <RemoveButton onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )

}

export const TagItemGrouped = (props: {
  mapped: Array<Tag>,
  onRemove: (tag: Tag) => any,
  onRemoveParent: (tags: Array<Tag>) => any
}) => {

  //TODO collapse button
  return (
    <span className="snovy-tag-item-grouped">
      <div className="tag-group-header">
        <CollapseButton collapsed={false} onClick={() => ""}/>
        <span className="tag-scope">{props.mapped[0].scope!.name}</span>
        <RemoveButton onClick={() => props.onRemoveParent(props.mapped)}/>
      </div>
      <div className="tag-container">
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>
    </span>
  )

}

export const TagItemExclusive = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => any,
  onRemoveParent: (tags: Tag) => any
}) => {

  return (
    <span className="snovy-tag-item-exclusive">
      <span className="tag-scope">{props.mapped.scope}</span>
      <TagItem mapped={props.mapped} onRemove={props.onRemove}/>
      <RemoveButton onClick={() => props.onRemoveParent(props.mapped)}/>
    </span>
  )

}