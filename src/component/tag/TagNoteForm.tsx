import React, {useRef, useState} from "react"
import {AddButton} from "../Button"
import {useHide} from "../../Hooks"
import TagSelector from "./TagSelector"

const TagNoteForm = () => {

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, x, y, handleClick, flip} = useHide(selfRef)

  const [create, setCreate] = useState(false)

  return (
    <div ref={selfRef} id={"tag-add-wrapper"}>
      <AddButton onClick={handleClick}/>
      {visible &&
      <TagSelector/>
      }
    </div>
  )
}

export default TagNoteForm