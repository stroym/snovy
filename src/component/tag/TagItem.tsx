import React, {useState} from "react"
import Tag from "../../data/model/Tag"
import {Button, ToggleButton} from "../inputs/Button"
import Scope from "../../data/model/Scope"
import {default as TinyColor} from "tinycolor2"
import {useTheme} from "@emotion/react"

export const TagItem = (props: {
  mapped: Tag,
  onRemove: (tag: Tag) => void,
}) => {

  const tiny = new TinyStyle(props.mapped.color, 10)

  return (
    <span className="snovy-tag-item" style={tiny.style}>
      <span className="tag-name" style={tiny.lighten(10)}>{props.mapped.title}</span>
      <Button preset="remove" circular mono onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )
}

export const TagItemScoped = (props: TagItemProps) => {

  const [collapsed, setCollapsed] = useState(false)

  const tiny = new TinyStyle(props.scope.color, 10)

  return (
    <span className="snovy-tag-item tag-grouped" style={tiny.style}>
      <div className="tag-group-header">
        <ToggleButton preset="collapse" circular mono getState={setCollapsed}/>
        <span className="tag-scope">{props.scope.title}</span>
        <Button preset="remove" circular mono onClick={() => props.onRemove(props.mapped)}/>
      </div>
      {!collapsed && <div className="tag-container" style={tiny.lighten(50)}>
        {props.mapped.map(tag => <TagItem key={tag.toString()} mapped={tag} onRemove={props.onRemove}/>)}
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
      <Button preset="remove" circular mono onClick={() => props.onRemove(props.mapped)}/>
    </span>
  )
}

type TagItemProps = {
  scope: Scope
  mapped: Array<Tag>
  onRemove: (tag: Tag | Array<Tag>) => void
}

//TODO try to figure out a better way of doing this, I don't like the constructor and having tags dependent on theme
export class TinyStyle {

  private theme = useTheme()

  tiny: TinyColor.Instance
  style: React.CSSProperties = {}
  invert = false

  constructor(color: string, maxAdjustment?: number) {
    this.tiny = new TinyColor(color)

    if (!color.isBlank()) {
      this.style["backgroundColor"] = this.tiny.toHex8String()
    }

    if (maxAdjustment) {
      if (maxAdjustment > 0) {
        this.evaluate(this.tiny.clone().lighten(maxAdjustment))
      } else {
        this.evaluate(this.tiny.clone().darken(-maxAdjustment))
      }
    } else {
      this.evaluate(this.tiny.clone())
    }
  }

  private evaluate(adjusted: TinyColor.Instance) {
    if (TinyColor.isReadable(adjusted, this.theme.textPrimary)) {
      this.style["color"] = this.theme.textPrimary
    } else {
      this.style["color"] = this.theme.textSecondary
      this.invert = true
    }
  }

  lighten(amount: number) {
    return {backgroundColor: this.tiny.clone().brighten(amount).toHex8String()}
  }

  darken(amount: number) {
    return {backgroundColor: this.tiny.clone().darken(amount).toHex8String()}
  }

}