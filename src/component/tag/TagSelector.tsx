import React from "react"
import Scope from "../../model/coloured/Scope"

export const TagSelector = (props: {
  initialValue?: string,
  scope?: Scope
}) => {

  return (
    <span className="snovy-tag-selector">
      <form id="tag-add-form">
        <span>
          <input type="checkbox"/>
          <input placeholder="New scope name..."/>
          <button type="button"/>
          {/*<SketchPicker presetColors={[]}></SketchPicker>*/}
        </span>
        <span>
          <input placeholder="New tag Name..."/>
          <button type="button"/>
          {/*<SketchPicker presetColors={[]}></SketchPicker>*/}
        </span>
        <button type="button">{"add"}</button>
      </form>
    </span>
  )

}

export default TagSelector