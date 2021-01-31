import React, {useEffect, useRef, useState} from "react"
import ContextMenuItem from "./ContextMenuItem"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  resetContext: () => any,
  children?: Array<React.ReactElement<typeof ContextMenuItem>>
}) => {

  if (!props.children) {
    return null
  }

  const selfRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(
    () => {
      document.addEventListener("mousedown", handleOutsideClick)
      props.parentRef.current?.addEventListener("contextmenu", handleContextMenu)

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick)
        props.parentRef.current?.removeEventListener("contextmenu", handleContextMenu)
      }
    }, []
  )

  const handleOutsideClick = (e: any) => {
    if (!selfRef.current?.contains(e.target)) {
      onClickFinish()
    }
  }

  const onClickFinish = () => {
    setVisible(false)
    props.resetContext()
  }

  const handleContextMenu = (e: any) => {
    e.preventDefault()

    if (!selfRef.current?.contains(e.target)) {
      setX(e.pageX)
      setY(e.pageY)

      setVisible(true)
    }
  }

  return (
    <>
      {visible &&
      <div className="snovy-context-menu" ref={selfRef} onClick={() => onClickFinish()}
           style={{
             position: "absolute",
             top: y + "px",
             left: x + "px"
           }}
      >
        {props.children}
      </div>
      }
    </>
  )

}

export default ContextMenu