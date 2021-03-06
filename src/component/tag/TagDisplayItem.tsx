import React from "react"
import Tag from "../../data/model/Tag"
import {ColorHelper} from "../inputs/ColorPicker"

const TagDisplayItem = (props: {
  tag: Tag
}) => {

  return (
    <div className="snovy-tag-detail">
      {
        props.tag.scope &&
        <div className="scope-detail">
          <ColorHelper color={props.tag.scope.color} text={props.tag.scope.unique ? "❆" : ""}/>
          <span className="title-helper">{props.tag.scope.title}</span>
        </div>
      }
      <div className="tag-detail">
        <ColorHelper color={props.tag.color}/>
        <span className="title-helper">{props.tag.title}</span>
      </div>
    </div>
  )

}

export default TagDisplayItem