import React, {useState} from "react"
import Tag from "../../data/model/Tag"
import {CollapseButton, RemoveButton} from "../inputs/Button"
import Scope from "../../data/model/Scope"
import {default as TinyColor} from "tinycolor2"

//TODO invert button onHover as well as the text color

export const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => void,
}) => {

  const tiny = new TinyStyle(props.mapped.color, 10)

  return (
    <span className="snovy-tag-item" style={tiny.style}>
      <span className="tag-name" style={tiny.lighten(10)}>{props.mapped.title}</span>
      <RemoveButton onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )
}

export const TagItemScoped = (props: TagItemProps) => {

  const [collapsed, setCollapsed] = useState(false)

  const tiny = new TinyStyle(props.scope.color, 20)

  return (
    <span className="snovy-tag-item tag-grouped" style={tiny.style}>
      <div className="tag-group-header">
        <CollapseButton onClick={() => {setCollapsed(!collapsed)}} toggle={collapsed}/>
        <span className="tag-scope">{props.scope.title}</span>
        <RemoveButton onClick={() => props.onRemove(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container" style={tiny.lighten(50)}>
        {props.mapped.map((tag) => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
      </div>}
    </span>
  )
}

export const TagItemScopedUnique = (props: TagItemProps) => {

  const tiny = new TinyStyle(props.scope.color, 20)

  return (
    <span className="snovy-tag-item tag-unique" style={tiny.style}>
      <span className="tag-scope" style={tiny.lighten(20)}>{props.scope.title}</span>
      <span className="tag-name" style={tiny.lighten(10)}>{props.mapped[0].title}</span>
      <RemoveButton onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )
}

type TagItemProps = {
  scope: Scope
  mapped: Array<Tag>
  onRemove: (tag: Tag | Array<Tag>) => void
}

class TinyStyle {

  tiny: TinyColor.Instance
  style: React.CSSProperties = {}

  constructor(color: string, maxAdjustment?: number) {
    this.tiny = new TinyColor(color)

    this.style["backgroundColor"] = this.tiny.toHex8String()

    if (maxAdjustment) {
      if (maxAdjustment > 0) {
        if (this.tiny.clone().lighten(maxAdjustment).isDark()) {
          this.style["color"] = "#ffffff"
        } else {
          this.style["color"] = "#000000"
        }
      } else {
        if (this.tiny.clone().darken(-maxAdjustment).isDark()) {
          this.style["color"] = "#ffffff"
        } else {
          this.style["color"] = "#000000"
        }
      }
    } else {
      this.style["color"] = this.tiny.isDark() ? "#ffffff" : "#000000"
    }
  }

  lighten(amount: number) {
    return {backgroundColor: this.tiny.clone().brighten(amount).toHex8String()}
  }

  darken(amount: number) {
    return {backgroundColor: this.tiny.clone().darken(amount).toHex8String()}
  }

}