import React from "react"
import Tag from "../../data/model/Tag"
import {ColorHelper} from "../inputs/ColorPicker"
import {default as UniqueIcon} from "../../../public/icons/unique.svg"

const TagDisplayItem = (props: {
  tag: Tag
}) => {

  return (
    <div className="snovy-tag-detail">
      {
        props.tag.scope &&
        <div className="scope-detail">
          <ColorHelper color={props.tag.scope.color}>
            {props.tag.scope.unique && <UniqueIcon/>}
          </ColorHelper>
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