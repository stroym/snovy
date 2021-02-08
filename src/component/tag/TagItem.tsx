import React, {useState} from "react"
import Tag from "../../model/coloured/Tag"
import {CollapseButton, RemoveButton} from "../inputs/Button"
import Scope from "../../model/coloured/Scope"

export const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => void,
}) => {
  return (
    <span className="snovy-tag-item" style={{backgroundColor: props.mapped.colour}}>
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
//TODO adjust dark colours to be lighter and vice versa + maybe invert button colours
export const ScopedTagItem = (props: TagItemProps) => {

  const [collapsed, setCollapsed] = useState(false)

  return (
    <span className="snovy-tag-item tag-grouped" style={{backgroundColor: props.scope.colour}}>
      <div className="tag-group-header">
        <CollapseButton onClick={() => {setCollapsed(!collapsed)}} toggle={collapsed}/>
        <span className="tag-scope">{props.scope.name}</span>
        <RemoveButton onClick={() => props.onRemoveScope(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container" style={{backgroundColor: adjust(props.scope.colour, -30)}}>
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>}
    </span>
  )
}

export const ExclusiveScopedTagItem = (props: TagItemProps) => {
  return (
    <span className="snovy-tag-item tag-exclusive" style={{backgroundColor: props.scope.colour}}>
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

function adjust(color: string, amount: number) {
  return "#" + color.replace(/^#/, "").replace(/../g, color => ("0" + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2))
}
