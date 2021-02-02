import React, {useState} from "react"
import Tag from "../../model/coloured/Tag"
import {CollapseButton, RemoveButton} from "./Button"
import Scope from "../../model/coloured/Scope"

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

export const TagItemScoped = (props: {
  scope: Scope,
  mapped: Array<Tag>,
  onRemove: (tag: Tag) => any,
  onRemoveParent: (tags: Array<Tag>) => any
}) => {

  return (
    <>
      {props.scope.exclusive ?
        <ExclusiveScopedTagItem scope={props.scope} mapped={props.mapped} onRemove={props.onRemove}
                                onRemoveParent={props.onRemoveParent}/> :
        <ScopedTagItem scope={props.scope} mapped={props.mapped} onRemove={props.onRemove}
                       onRemoveParent={props.onRemoveParent}/>
      }
    </>
  )

}

export const ScopedTagItem = (props: {
  scope: Scope,
  mapped: Array<Tag>,
  onRemove: (tag: Tag) => any,
  onRemoveParent: (tags: Array<Tag>) => any
}) => {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <span className="snovy-tag-item tag-grouped">
      <div className="tag-group-header">
        <CollapseButton onClick={() => {setCollapsed(!collapsed)}}/>
        <span className="tag-scope">{props.scope.name}</span>
        <RemoveButton onClick={() => props.onRemoveParent(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container">
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>}
    </span>
  )

}

export const ExclusiveScopedTagItem = (props: {
  scope: Scope,
  mapped: Array<Tag>,
  onRemove: (tag: Tag) => any,
  onRemoveParent: (tags: Array<Tag>) => any
}) => {

  return (
    <span className="snovy-tag-item tag-exclusive">
      <span className="tag-scope">{props.scope.name}</span>
      <span className="tag-name"> {props.mapped[0].name}</span>
      <RemoveButton onClick={() => props.onRemove(props.mapped[0])}/>
    </span>
  )

}