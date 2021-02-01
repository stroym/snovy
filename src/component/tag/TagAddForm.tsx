import React, {useEffect, useRef, useState} from "react"
import {AddButton} from "./Button"

const TagAddForm = () => {

  const selfRef = useRef<HTMLDivElement>()

  const [visible, setVisible] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
      }
    }, []
  )

  const handleOutsideClick = (e: any) => {
    if (!selfRef.current?.contains(e.target)) {
      setVisible(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    let negate = !visible

    if (negate) {
      setX(e.pageX)
      setY(e.pageY)
    }

    setVisible(negate)

  }

  return (
    <div id={"add-wrapper"}>
      <AddButton onClick={handleClick}/>
      {visible &&
      <form id="tag-add-form" style={{
        zIndex: 10,
        position: "fixed",
        top: y + "px",
        left: x + "px"
      }}
      >
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
      </form>}
    </div>
  )
}

export default TagAddForm