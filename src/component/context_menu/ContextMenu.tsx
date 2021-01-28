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

  const handleOutsideClick = (event: any) => {
    if (!selfRef.current?.contains(event.target)) {
      onClickFinish()
    }
  }

  const onClickFinish = () => {
    setVisible(false)
    props.resetContext()
  }

  const handleContextMenu = (event: any) => {
    event.preventDefault()

    setX(event.pageX)
    setY(event.pageY)

    setVisible(true)
  }

  return (
    <div className="snovy-context-menu" hidden={!visible} ref={selfRef}
         onClick={() => onClickFinish()}
         style={{
           position: "absolute",
           top: y + "px",
           left: x + "px"
         }}>
      {props.children}
    </div>
  )

}

export default ContextMenu