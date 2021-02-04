import React, {useEffect, useRef} from "react"
import ContextMenuItem from "./ContextMenuItem"
import {useHide} from "../../Hooks"

const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  resetContext: () => void,
  children?: Array<React.ReactElement<typeof ContextMenuItem>>
}) => {

  if (!props.children) {
    return null
  }

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, x, y, handleClick, flip} = useHide(selfRef)

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

    handleClick(e)
  }

  return (
    <>
      {visible &&
      <div
        className="snovy-context-menu" ref={selfRef} onClick={flip}
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