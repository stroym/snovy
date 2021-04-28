import React, {useRef} from "react"
import ContextMenuItem from "./ContextMenuItem"
import {useContextMenu} from "../../util/hooks"
import {isArray} from "../../util/utils"

//TODO try to make this one global context menu and only set items when clicking eligible elements
const ContextMenu = (props: {
  parentRef: React.RefObject<Element>,
  children: Array<React.ReactElement<typeof ContextMenuItem> | undefined> | React.ReactElement<typeof ContextMenuItem>,
  onFinish: () => void
}) => {

  if (isArray(props.children) && props.children.isEmpty()) {
    return null
  }

  const selfRef = useRef<HTMLDivElement>(null)

  const {visible, setVisible, position} = useContextMenu(selfRef, props.parentRef)

  return (
    <>
      {visible &&
      <div
        className="snovy-context-menu" ref={selfRef} style={position}
        onClick={() => {
          props.onFinish()
          setVisible(false)
        }}
      >
        {props.children}
      </div>
      }
    </>
  )

}

export default ContextMenu