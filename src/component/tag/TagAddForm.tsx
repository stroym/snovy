import React from "react"
import {SketchPicker} from "react-color"

const TagAddForm = () => {

  return (
    <div>
      <form id="tag-add-form">
        <input/>
        <button>{"+"}</button>
        <SketchPicker presetColors={[]}></SketchPicker>
      </form>
    </div>
  )
}

export default TagAddForm