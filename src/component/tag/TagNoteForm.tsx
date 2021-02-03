import React, {useRef, useState} from "react"
import {AddButton} from "./Button"
import {useOutsideClick} from "../../Hooks"
import TagSelector from "./TagSelector"

const TagNoteForm = () => {

  const selfRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useOutsideClick(selfRef)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [create, setCreate] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    let negate = !visible

    if (negate) {
      setX(e.pageX)
      setY(e.pageY)
    }

    setVisible(negate)
  }

  return (
    <div ref={selfRef} id={"tag-add-wrapper"}>
      <AddButton onClick={handleClick}/>
      {visible &&
      <TagSelector/>
        // <form id="tag-add-form">
        //   <span>
        //     <input type="checkbox"/>
        //     <input placeholder="New scope name..."/>
        //     <button type="button"/>
        //     {/*<SketchPicker presetColors={[]}></SketchPicker>*/}
        //   </span>
        //   <span>
        //     <input placeholder="New tag Name..."/>
        //     <button type="button"/>
        //     {/*<SketchPicker presetColors={[]}></SketchPicker>*/}
        //   </span>
        //   <button type="button">{"add"}</button>
        // </form>
      }
    </div>
  )
}

export default TagNoteForm