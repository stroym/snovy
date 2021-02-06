import React, {useState} from "react"
import Tag from "../../model/coloured/Tag"
import {CollapseButton, RemoveButton} from "../Button"
import Scope from "../../model/coloured/Scope"

export const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => void,
}) => {

  return (
    <span className="snovy-tag-item">
      <span className="tag-name">{props.mapped.name}</span>
      <RemoveButton onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )

}

export const TagItemScoped = (props: TagItemProps) => {

  return (
    <>
      {props.scope.exclusive ?
        <ExclusiveScopedTagItem
          scope={props.scope} mapped={props.mapped} onRemove={props.onRemove}
          onRemoveScope={props.onRemoveScope}
        /> :
        <ScopedTagItem
          scope={props.scope} mapped={props.mapped} onRemove={props.onRemove}
          onRemoveScope={props.onRemoveScope}
        />
      }
    </>
  )

}

//TODO on mouse over show containing tags
export const ScopedTagItem = (props: TagItemProps) => {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <span className="snovy-tag-item tag-grouped">
      <div className="tag-group-header">
        <CollapseButton onClick={() => {setCollapsed(!collapsed)}}/>
        <span className="tag-scope">{props.scope.name}</span>
        <RemoveButton onClick={() => props.onRemoveScope(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container">
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>}
    </span>
  )

}

export const ExclusiveScopedTagItem = (props: TagItemProps) => {

  return (
    <span className="snovy-tag-item tag-exclusive">
      <span className="tag-scope">{props.scope.name}</span>
      <span className="tag-name"> {props.mapped[0].name}</span>
      <RemoveButton onClick={() => props.onRemoveScope(props.mapped)}/>
    </span>
  )

}

type TagItemProps = {
  scope: Scope,
  mapped: Array<Tag>,
  onRemove: (tag: Tag) => void,
  onRemoveScope: (tags: Array<Tag>) => void
}