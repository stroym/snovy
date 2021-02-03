import React, {useEffect, useRef, useState} from "react"
import ContextMenuItem from "./ContextMenuItem"
import {useHideOnOutsideClick} from "../../Hooks"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  resetContext: () => void,
  children?: Array<React.ReactElement<typeof ContextMenuItem>>
}) => {

  if (!props.children) {
    return null
  }

  const selfRef = useRef<HTMLDivElement>(null)

  const [visible, , flip] = useHideOnOutsideClick(selfRef)
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  useEffect(
    () => {
      props.parentRef.current?.addEventListener("contextmenu", handleContextMenu)

      return () => {
        props.parentRef.current?.removeEventListener("contextmenu", handleContextMenu)
      }
    }, []
  )

  useEffect(
    () => {
      if (!visible) {
        props.resetContext()
      }
    }, [visible]
  )

  const handleContextMenu = (e: any) => {
    e.preventDefault()

    if (!selfRef.current?.contains(e.target)) {
      setX(e.pageX)
      setY(e.pageY)

      flip()
    }
  }

  return (
    <>
      {visible &&
      <div className="snovy-context-menu" ref={selfRef} onClick={flip}
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