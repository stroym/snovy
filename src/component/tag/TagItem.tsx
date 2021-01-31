import React, {useState} from "react"
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

  const [collapsed, setCollapsed] = useState(false)

  return (
    <span className="snovy-tag-item-grouped">
      <div className="tag-group-header">
        <CollapseButton onClick={() => {setCollapsed(!collapsed)}}/>
        <span className="tag-scope">{props.mapped[0].scope!.name}</span>
        <RemoveButton onClick={() => props.onRemoveParent(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container">
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>}
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